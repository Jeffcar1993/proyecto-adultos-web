import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../config/db.ts';
import type { AuthRequest } from '../middlewares/authMiddleware.ts';
import { sendResetPasswordEmail } from '../services/emailService.ts';

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

  // Respuesta genérica siempre — no se revela si el email existe o no
  const genericResponse = { message: 'Si el correo está registrado, recibirás instrucciones en breve.' };

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'El correo es obligatorio.' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (!userResult.rows.length) {
      // No revelar que el email no existe (previene enumeración de usuarios)
      return res.status(200).json(genericResponse);
    }

    // Token aleatorio de 32 bytes — más seguro que JWT para este caso
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await pool.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetTokenHash, expiresAt, userResult.rows[0].id]
    );

    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    // No exponer detalles del error interno
    return res.status(500).json({ error: 'Error al procesar la solicitud. Intenta de nuevo.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios.' });
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id, reset_token, reset_token_expires FROM usuarios WHERE reset_token IS NOT NULL',
      []
    );

    // Buscar el usuario cuyo hash coincide con el token recibido
    let matchedUser: { id: number; reset_token: string; reset_token_expires: Date } | null = null;
    for (const row of userResult.rows) {
      if (await bcrypt.compare(token, row.reset_token)) {
        matchedUser = row;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(400).json({ error: 'Token inválido.' });
    }

    if (new Date() > new Date(matchedUser.reset_token_expires)) {
      return res.status(400).json({ error: 'El enlace ha expirado. Solicita uno nuevo.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE usuarios SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashedPassword, matchedUser.id]
    );

    return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ error: 'Error al restablecer la contraseña.' });
  }
};