import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.js';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado" });
    req.userId = decoded.userId;
    next();
  });
};