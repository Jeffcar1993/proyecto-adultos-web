import type { Request, Response } from 'express';
import pool from '../config/db.ts';
import { uploadToCloudinary } from '../config/cloudinary.ts';
import type { AuthRequest } from '../middlewares/authMiddleware.ts';

export const crearPerfil = async (req: AuthRequest, res: Response) => {
  const { nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp } = req.body;
  const usuario_id = req.userId; // Obtenido del Token

  try {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];

    if (!files.length) {
      return res.status(400).json({ error: 'Debes subir al menos una foto.' });
    }

    const fotosUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, 'perfiles_adultos'))
    );
    const fotoPrincipal = fotosUrls[0];

    const query = `
      INSERT INTO perfiles 
      (nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp, usuario_id, fotos, foto_principal)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp, 
      usuario_id, fotosUrls, fotoPrincipal
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
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
        SELECT id, nombre, foto_principal, telefono, whatsapp, ciudad, barrio, departamento
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
      `SELECT id, nombre, descripcion, foto_principal, ciudad, departamento, barrio, telefono, whatsapp, created_at
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