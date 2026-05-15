import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import pool from '../config/db.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// ─────────────────────────────────────────────
// GET /api/tokens/paquetes  (público)
// ─────────────────────────────────────────────
export async function getPaquetes(_req: AuthRequest, res: Response) {
  const result = await pool.query(
    'SELECT id, nombre, cantidad_tokens, precio_cop FROM paquetes_tokens WHERE activo = TRUE ORDER BY precio_cop ASC'
  );
  res.json(result.rows);
}

// ─────────────────────────────────────────────
// GET /api/tokens/billetera  (auth)
// ─────────────────────────────────────────────
export async function getBilletera(req: AuthRequest, res: Response) {
  const userId = req.userId!;

  const [userResult, historialResult] = await Promise.all([
    pool.query('SELECT saldo_tokens FROM usuarios WHERE id = $1', [userId]),
    pool.query(
      `SELECT oc.id, oc.monto_total, oc.estado, oc.created_at,
              pt.nombre AS paquete, pt.cantidad_tokens
       FROM ordenes_compra oc
       JOIN paquetes_tokens pt ON oc.paquete_id = pt.id
       WHERE oc.usuario_id = $1
       ORDER BY oc.created_at DESC
       LIMIT 20`,
      [userId]
    ),
  ]);

  res.json({
    saldo: userResult.rows[0]?.saldo_tokens ?? 0,
    historial: historialResult.rows,
  });
}

// ─────────────────────────────────────────────
// POST /api/tokens/comprar  (auth, multipart)
// ─────────────────────────────────────────────
export async function createOrden(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const paquete_id = Number(req.body.paquete_id);

  if (!paquete_id || isNaN(paquete_id)) {
    res.status(400).json({ error: 'Debes seleccionar un paquete' });
    return;
  }

  const paqueteResult = await pool.query(
    'SELECT id, precio_cop FROM paquetes_tokens WHERE id = $1 AND activo = TRUE',
    [paquete_id]
  );

  if (paqueteResult.rows.length === 0) {
    res.status(404).json({ error: 'Paquete no encontrado' });
    return;
  }

  const { precio_cop } = paqueteResult.rows[0];

  // Subir comprobante a Cloudinary si viene adjunto
  let urlComprobante: string | null = null;
  const file = req.file;
  if (file) {
    urlComprobante = await uploadToCloudinary(file.buffer, 'comprobantes');
  }

  const result = await pool.query(
    `INSERT INTO ordenes_compra (usuario_id, paquete_id, monto_total, url_comprobante)
     VALUES ($1, $2, $3, $4)
     RETURNING id, estado, created_at`,
    [userId, paquete_id, precio_cop, urlComprobante]
  );

  res.status(201).json(result.rows[0]);
}

// ─────────────────────────────────────────────
// ADMIN: GET /api/admin/ordenes
// ─────────────────────────────────────────────
export async function getOrdenesPendientes(_req: AuthRequest, res: Response) {
  const result = await pool.query(
    `SELECT oc.id, oc.monto_total, oc.estado, oc.url_comprobante, oc.created_at,
            u.email, u.nombre AS usuario_nombre,
            pt.nombre AS paquete, pt.cantidad_tokens
     FROM ordenes_compra oc
     JOIN usuarios u ON oc.usuario_id = u.id
     JOIN paquetes_tokens pt ON oc.paquete_id = pt.id
     WHERE oc.estado = 'pendiente'
     ORDER BY oc.created_at ASC`
  );
  res.json(result.rows);
}

// ─────────────────────────────────────────────
// ADMIN: POST /api/admin/ordenes/:id/aprobar
// ─────────────────────────────────────────────
export async function aprobarOrden(req: AuthRequest, res: Response) {
  const ordenId = parseInt(String(req.params.id), 10);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ordenResult = await client.query(
      `SELECT oc.usuario_id, pt.cantidad_tokens
       FROM ordenes_compra oc
       JOIN paquetes_tokens pt ON oc.paquete_id = pt.id
       WHERE oc.id = $1 AND oc.estado = 'pendiente'
       FOR UPDATE`,
      [ordenId]
    );

    if (ordenResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Orden no encontrada o ya procesada' });
      return;
    }

    const { usuario_id, cantidad_tokens } = ordenResult.rows[0];

    await client.query(
      `UPDATE ordenes_compra SET estado = 'completado' WHERE id = $1`,
      [ordenId]
    );

    await client.query(
      `UPDATE usuarios SET saldo_tokens = COALESCE(saldo_tokens, 0) + $1 WHERE id = $2`,
      [cantidad_tokens, usuario_id]
    );

    await client.query('COMMIT');
    res.json({ ok: true, tokens_acreditados: cantidad_tokens });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────
// ADMIN: POST /api/admin/ordenes/:id/rechazar
// ─────────────────────────────────────────────
export async function rechazarOrden(req: AuthRequest, res: Response) {
  const ordenId = parseInt(String(req.params.id), 10);

  const result = await pool.query(
    `UPDATE ordenes_compra SET estado = 'cancelado'
     WHERE id = $1 AND estado = 'pendiente'
     RETURNING id`,
    [ordenId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Orden no encontrada o ya procesada' });
    return;
  }

  res.json({ ok: true });
}
