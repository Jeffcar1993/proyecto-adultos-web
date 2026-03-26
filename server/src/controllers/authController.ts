import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.ts';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // 1. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Guardar en Neon
    const result = await pool.query(
      'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario creado", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "El email ya existe o error de servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3. Generar el Token (JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_key_provisoria',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};