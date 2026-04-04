import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authMiddleware.ts';
import pool from '../config/db.ts';

export async function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const result = await pool.query(
    'SELECT is_admin FROM usuarios WHERE id = $1',
    [req.userId]
  );

  if (result.rows[0]?.is_admin !== true) {
    res.status(403).json({ error: 'Acceso restringido' });
    return;
  }

  next();
}
