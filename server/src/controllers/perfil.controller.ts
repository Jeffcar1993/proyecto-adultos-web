import type { Request, Response } from 'express';
import pool from '../config/db.ts';
import { uploadToCloudinary } from '../config/cloudinary.ts';

export const createPerfil = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, telefono, whatsapp } = req.body;
    const files = req.files as Express.Multer.File[];

    // 1. Validar que existan archivos
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Debes subir al menos una foto." });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "El máximo de fotos permitido es 5." });
    }

    // 2. Subir imágenes a Cloudinary en paralelo para mayor velocidad
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, 'perfiles_adultos')
    );
    
    const photosUrls = await Promise.all(uploadPromises);

    // 3. Definir foto principal (por defecto la primera del array)
    // En el futuro, el frontend podría enviar un índice para elegirla
    const foto_principal = photosUrls[0];

    // 4. Insertar en Neon (PostgreSQL)
    const query = `
      INSERT INTO perfiles (nombre, descripcion, telefono, whatsapp, fotos, foto_principal)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      nombre, 
      descripcion, 
      telefono, 
      whatsapp, 
      photosUrls, // El driver 'pg' convierte el array de JS a ARRAY de Postgres automáticamente
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