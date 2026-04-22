import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import https from 'https';
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
      'INSERT INTO usuarios (nombre, email, password, saldo_tokens) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email',
      [nombre, email, hashedPassword, 2]
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
      user: { ...newUser, is_admin: false },
    });
  } catch (error) {
    res.status(500).json({ error: "El email ya existe o error de servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT id, nombre, email, password, is_admin FROM usuarios WHERE email = $1', [email]);
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

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, is_admin: user.is_admin ?? false } });
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
      'SELECT id, nombre, email, is_admin FROM usuarios WHERE id = $1',
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

export const googleAuth = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Token de Google no proporcionado.' });
  }

  try {
    // Verificar el access_token llamando a la API de Google desde el servidor
    const googleUser = await new Promise<{
      sub: string; email: string; name: string; email_verified: boolean;
    }>((resolve, reject) => {
      https.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${credential}` } },
        (googleRes) => {
          let data = '';
          googleRes.on('data', (chunk) => (data += chunk));
          googleRes.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) return reject(new Error(parsed.error.message ?? 'Token inválido'));
              resolve(parsed);
            } catch {
              reject(new Error('Respuesta inválida de Google'));
            }
          });
        }
      ).on('error', reject);
    });

    if (!googleUser.email_verified) {
      return res.status(400).json({ error: 'El correo de Google no está verificado.' });
    }

    const { sub: googleId, email, name } = googleUser;

    // Buscar usuario existente por google_id o email
    let userResult = await pool.query(
      'SELECT id, nombre, email, google_id, is_admin FROM usuarios WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user = userResult.rows[0];

    if (!user) {
      // Crear nuevo usuario sin contraseña (solo Google)
      const insertResult = await pool.query(
        'INSERT INTO usuarios (nombre, email, google_id, saldo_tokens) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email',
        [name ?? email.split('@')[0], email, googleId, 2]
      );
      user = insertResult.rows[0];
    } else if (!user.google_id) {
      // Cuenta existente por email — vincular google_id
      await pool.query('UPDATE usuarios SET google_id = $1 WHERE id = $2', [googleId, user.id]);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_key_provisoria',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, is_admin: user.is_admin ?? false },
    });
  } catch (error) {
    console.error('Error en googleAuth:', error);
    return res.status(500).json({ error: 'Error al autenticar con Google.' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'No autenticado.' });
  }

  try {
    // Eliminar perfiles (anuncios) del usuario primero por FK
    await pool.query('DELETE FROM perfiles WHERE usuario_id = $1', [userId]);

    // Eliminar el usuario
    await pool.query('DELETE FROM usuarios WHERE id = $1', [userId]);

    return res.status(200).json({ message: 'Cuenta eliminada correctamente.' });
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    return res.status(500).json({ error: 'No se pudo eliminar la cuenta. Intenta de nuevo.' });
  }
};
