import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { upload } from '../middlewares/multer.js';
import { validateResource } from '../middlewares/validateResource.js';
import {
  getPaquetes,
  getBilletera,
  createOrden,
  getOrdenesPendientes,
  aprobarOrden,
  rechazarOrden,
} from '../controllers/tokens.controller.js';
import {
  ApproveOrdenSchema,
  RejectOrdenSchema,
  CreateOrdenSchema,
} from '../schema/tokens.schema.js';

const router = Router();

// Públicas
router.get('/tokens/paquetes', getPaquetes);

// Usuario autenticado
router.get('/tokens/billetera', authenticateToken, getBilletera);
router.post(
  '/tokens/comprar',
  authenticateToken,
  upload.single('comprobante'),
  validateResource(CreateOrdenSchema),
  createOrden
);

// Admin
router.get('/admin/ordenes', authenticateToken, adminMiddleware, getOrdenesPendientes);
router.post(
  '/admin/ordenes/:id/aprobar',
  authenticateToken,
  adminMiddleware,
  validateResource(ApproveOrdenSchema),
  aprobarOrden
);
router.post(
  '/admin/ordenes/:id/rechazar',
  authenticateToken,
  adminMiddleware,
  validateResource(RejectOrdenSchema),
  rechazarOrden
);

export default router;
