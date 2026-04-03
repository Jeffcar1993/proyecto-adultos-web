import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.ts';
import type { AuthRequest } from '../middlewares/authMiddleware.ts';

export const register = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
  }

  try {
    // 1. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Guardar en Neon
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hashedPassword]
    );

    const newUser = result.rows[0];
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'secret_key_provisoria',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario creado',
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: "El email ya existe o error de servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT id, nombre, email, password FROM usuarios WHERE email = $1', [email]);
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

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const result = await pool.query(
      'SELECT id, nombre, email FROM usuarios WHERE id = $1',
      [req.userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
};
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo es obligatorio.' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ error: 'No existe usuario con ese correo.' });
    }

    const resetToken = jwt.sign(
      { userId: userResult.rows[0].id, email, type: 'password-reset' },
      process.env.JWT_SECRET || 'secret_key_provisoria',
      { expiresIn: '1h' }
    );

    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 3600000);

    await pool.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetTokenHash, expiresAt, userResult.rows[0].id]
    );

    return res.json({
      message: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios.' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_key_provisoria'
    ) as { userId: number; type: string };

    if (decoded.type !== 'password-reset') {
      return res.status(400).json({ error: 'Token inválido.' });
    }

    const userResult = await pool.query(
      'SELECT reset_token, reset_token_expires FROM usuarios WHERE id = $1',
      [decoded.userId]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const user = userResult.rows[0];
    if (!user.reset_token || new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ error: 'El token ha expirado. Solicita uno nuevo.' });
    }

    if (!(await bcrypt.compare(token, user.reset_token))) {
      return res.status(400).json({ error: 'Token inválido.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE usuarios SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashedPassword, decoded.userId]
    );

    return res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Token inválido o expirado.' });
    }
    res.status(500).json({ error: 'Error al resetear la contraseña.' });
  }
};