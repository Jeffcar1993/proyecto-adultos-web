import type { Request, Response } from 'express';
import pool from '../config/db.ts';
import { uploadToCloudinary } from '../config/cloudinary.ts';

export const createPerfil = async (req: Request, res: Response) => {
  try {
    // 1. Extraer los nuevos campos del body
    const { nombre, descripcion, telefono, whatsapp, ciudad, barrio } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Debes subir al menos una foto." });
    }

    // 2. Subida a Cloudinary (Tu lógica actual es perfecta)
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, 'perfiles_adultos')
    );
    const photosUrls = await Promise.all(uploadPromises);
    const foto_principal = photosUrls[0];

    // 3. Query actualizado con las nuevas columnas de Neon
    const query = `
      INSERT INTO perfiles (nombre, descripcion, telefono, whatsapp, ciudad, barrio, fotos, foto_principal)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nombre, 
      descripcion, 
      telefono, 
      whatsapp, 
      ciudad,   // $5
      barrio,   // $6
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
    // Solo traemos lo necesario para la vista miniatura
    const result = await pool.query(
      'SELECT id, nombre, foto_principal, telefono, whatsapp FROM perfiles ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
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