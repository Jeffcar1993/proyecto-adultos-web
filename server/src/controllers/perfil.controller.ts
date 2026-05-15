import type { Request, Response } from 'express';
import pool from '../config/db.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

export const crearPerfil = async (req: AuthRequest, res: Response) => {
  const { nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp, edad } = req.body;
  const usuario_id = req.userId; // Obtenido del Token

  try {
    if (!usuario_id) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];

    if (!files.length) {
      return res.status(400).json({ error: 'Debes subir al menos una foto.' });
    }

    // Subir fotos ANTES de iniciar transacción (no queremos bloquear la BD durante upload)
    const fotosUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, 'perfiles_adultos'))
    );
    const fotoPrincipal = fotosUrls[0];

    // Iniciar transacción ANTES de cualquier operación de BD
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar saldo de tokens con lock (dentro de transacción)
      const saldoResult = await client.query(
        'SELECT saldo_tokens FROM usuarios WHERE id = $1 FOR UPDATE',
        [usuario_id]
      );
      const saldo: number = saldoResult.rows[0]?.saldo_tokens ?? 0;
      if (saldo < 1) {
        await client.query('ROLLBACK');
        return res.status(402).json({ error: 'Saldo insuficiente. Necesitas al menos 1 token para publicar un anuncio.' });
      }

      const query = `
        INSERT INTO perfiles 
        (nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp, edad, usuario_id, fotos, foto_principal)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;

      const result = await client.query(query, [
        nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp,
        edad ? parseInt(edad) : null,
        usuario_id, fotosUrls, fotoPrincipal
      ]);

      // Descontar 1 token
      await client.query(
        'UPDATE usuarios SET saldo_tokens = saldo_tokens - 1 WHERE id = $1',
        [usuario_id]
      );

      await client.query('COMMIT');

      res.status(201).json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        return res.status(409).json({
          error: 'La base de datos todavía tiene activa la restricción de un anuncio por usuario. Reinicia el backend o elimina unique_usuario_perfil en Neon.'
        });
      }

      console.error(error);
      res.status(500).json({ error: "Error al crear el perfil" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error en crearPerfil (previo a transacción):', error);
    res.status(500).json({ error: "Error al crear el perfil" });
  }
};

export const getPerfiles = async (req: Request, res: Response) => {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const { departamento, ciudad, barrio, q } = req.query;

      // Construir WHERE dinámico
      const conditions: string[] = [];
      const params: unknown[] = [];
      let paramIndex = 1;

      if (departamento && typeof departamento === 'string') {
        conditions.push(`departamento = $${paramIndex}`);
        params.push(departamento);
        paramIndex++;
      }

      if (ciudad && typeof ciudad === 'string') {
        conditions.push(`ciudad = $${paramIndex}`);
        params.push(ciudad);
        paramIndex++;
      }

      if (barrio && typeof barrio === 'string') {
        conditions.push(`barrio ILIKE $${paramIndex}`);
        params.push(`%${barrio}%`);
        paramIndex++;
      }

      if (q && typeof q === 'string') {
        conditions.push(`nombre ILIKE $${paramIndex}`);
        params.push(`%${q}%`);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = `
        SELECT id, usuario_id, nombre, foto_principal, telefono, whatsapp, ciudad, barrio, departamento, verificado
        FROM perfiles
        ${whereClause}
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query, params);
      res.json(result.rows);
      return;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error("Error en getPerfiles (todos los reintentos fallaron):", error);
        res.status(500).json({ message: "Error al obtener perfiles - conexión BD" });
      } else {
        console.warn(`⚠️ Error en getPerfiles, reintentos restantes: ${retries}`);
        // Esperar un poco antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
};

export const getPerfilById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM perfiles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

export const getMisPerfiles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await pool.query(
      `SELECT id, nombre, descripcion, foto_principal, ciudad, departamento, barrio, telefono, whatsapp, verificado, created_at
       FROM perfiles
       WHERE usuario_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error en getMisPerfiles:', error);
    return res.status(500).json({ error: 'Error al obtener tus anuncios' });
  }
};

export const eliminarPerfil = async (req: AuthRequest, res: Response) => {
  const perfilId = parseInt(String(req.params.id), 10);
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: 'No autenticado.' });
  if (isNaN(perfilId)) return res.status(400).json({ error: 'ID inválido.' });

  try {
    // Obtener fotos antes de borrar para poder eliminarlas de Cloudinary
    const result = await pool.query(
      'SELECT fotos FROM perfiles WHERE id = $1 AND usuario_id = $2',
      [perfilId, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Anuncio no encontrado o no autorizado.' });
    }

    const fotos: string[] = result.rows[0].fotos ?? [];

    await pool.query('DELETE FROM perfiles WHERE id = $1', [perfilId]);

    // Eliminar imágenes de Cloudinary (best effort)
    await Promise.allSettled(fotos.map((url) => deleteFromCloudinary(url)));

    return res.status(200).json({ message: 'Anuncio eliminado.' });
  } catch (error) {
    console.error('Error en eliminarPerfil:', error);
    return res.status(500).json({ error: 'Error al eliminar el anuncio.' });
  }
};

export const verificarPerfil = async (req: AuthRequest, res: Response) => {
  const perfilId = parseInt(String(req.params.id), 10);
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: 'No autenticado.' });
  if (isNaN(perfilId)) return res.status(400).json({ error: 'ID inválido.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock atómico sobre el saldo del usuario
    const saldoResult = await client.query(
      'SELECT saldo_tokens FROM usuarios WHERE id = $1 FOR UPDATE',
      [userId]
    );
    const saldo: number = saldoResult.rows[0]?.saldo_tokens ?? 0;
    if (saldo < 1) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'Saldo insuficiente. Necesitas 1 token para verificar el anuncio.' });
    }

    // Verificar que el perfil pertenece al usuario y no está ya verificado
    const perfilResult = await client.query(
      'SELECT id, verificado FROM perfiles WHERE id = $1 AND usuario_id = $2',
      [perfilId, userId]
    );
    if (!perfilResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Anuncio no encontrado o no autorizado.' });
    }
    if (perfilResult.rows[0].verificado) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Este anuncio ya está verificado.' });
    }

    // Marcar como verificado
    await client.query('UPDATE perfiles SET verificado = TRUE WHERE id = $1', [perfilId]);

    // Descontar 1 token
    await client.query(
      'UPDATE usuarios SET saldo_tokens = saldo_tokens - 1 WHERE id = $1',
      [userId]
    );

    await client.query('COMMIT');
    return res.status(200).json({ message: 'Anuncio verificado correctamente.' });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error en verificarPerfil:', error);
    return res.status(500).json({ error: 'Error al verificar el anuncio.' });
  } finally {
    client.release();
  }
};

export const subirPerfil = async (req: AuthRequest, res: Response) => {
  const perfilId = parseInt(String(req.params.id), 10);
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: 'No autenticado.' });
  if (isNaN(perfilId)) return res.status(400).json({ error: 'ID inválido.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock atómico sobre el saldo del usuario
    const saldoResult = await client.query(
      'SELECT saldo_tokens FROM usuarios WHERE id = $1 FOR UPDATE',
      [userId]
    );
    const saldo: number = saldoResult.rows[0]?.saldo_tokens ?? 0;
    if (saldo < 1) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'Saldo insuficiente. Necesitas 1 token para subir el anuncio.' });
    }

    // Verificar que el perfil pertenece al usuario
    const perfilResult = await client.query(
      'SELECT id FROM perfiles WHERE id = $1 AND usuario_id = $2',
      [perfilId, userId]
    );
    if (!perfilResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Anuncio no encontrado o no autorizado.' });
    }

    // Actualizar created_at a ahora → queda de primero en el listado
    await client.query('UPDATE perfiles SET created_at = NOW() WHERE id = $1', [perfilId]);

    // Descontar 1 token
    await client.query(
      'UPDATE usuarios SET saldo_tokens = saldo_tokens - 1 WHERE id = $1',
      [userId]
    );

    await client.query('COMMIT');
    return res.status(200).json({ message: 'Anuncio subido al tope.' });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error en subirPerfil:', error);
    return res.status(500).json({ error: 'Error al subir el anuncio.' });
  } finally {
    client.release();
  }
};