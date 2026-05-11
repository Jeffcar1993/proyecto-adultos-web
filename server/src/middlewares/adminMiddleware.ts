import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authMiddleware.ts';
import pool from '../config/db.ts';

// Cache en memoria para roles de admin (TTL: 5 minutos)
const adminCache = new Map<number, { isAdmin: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.userId) {
    return res.status(401).json({ error: 'No autenticado.' });
  }

  try {
    // Verificar cache primero
    const cached = adminCache.get(req.userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      if (!cached.isAdmin) {
        return res.status(403).json({ error: 'Acceso restringido. Solo administradores pueden acceder.' });
      }
      return next();
    }

    // Si no está en cache, consultar BD
    const result = await pool.query(
      'SELECT is_admin FROM usuarios WHERE id = $1',
      [req.userId]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    const isAdmin = result.rows[0]?.is_admin === true;

    // Guardar en cache
    adminCache.set(req.userId, { isAdmin, timestamp: Date.now() });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acceso restringido. Solo administradores pueden acceder.' });
    }

    next();
  } catch (error) {
    console.error('Error en adminMiddleware:', error);
    res.status(500).json({ error: 'Error al verificar permisos.' });
  }
}

// Limpiar cache cuando un usuario cierre sesión (opcional, pero buena práctica)
export function clearAdminCache(userId: number) {
  adminCache.delete(userId);
}
