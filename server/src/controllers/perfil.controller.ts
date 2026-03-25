import type { Request, Response } from 'express';
import pool from '../config/db.ts';
import { uploadToCloudinary } from '../config/cloudinary.ts';

export const createPerfil = async (req: Request, res: Response) => {
  try {
    // Extraer campos del body
    const { nombre, descripcion, telefono, whatsapp, departamento, ciudad, barrio } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Debes subir al menos una foto." });
    }

    // Subida a Cloudinary
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, 'perfiles_adultos')
    );
    const photosUrls = await Promise.all(uploadPromises);
    const foto_principal = photosUrls[0];

    // Query actualizado con departamento y barrio
    const query = `
      INSERT INTO perfiles (nombre, descripcion, departamento, ciudad, barrio, telefono, whatsapp, fotos, foto_principal)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      nombre,
      descripcion,
      departamento,
      ciudad,
      barrio || null,
      telefono,
      whatsapp,
      photosUrls,
      foto_principal
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Perfil creado con éxito",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error en createPerfil:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getPerfiles = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Error en getPerfiles:", error);
    res.status(500).json({ message: "Error al obtener perfiles" });
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