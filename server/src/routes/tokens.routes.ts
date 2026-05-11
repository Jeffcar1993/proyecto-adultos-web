import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { adminMiddleware } from '../middlewares/adminMiddleware.ts';
import { upload } from '../middlewares/multer.ts';
import { validateResource } from '../middlewares/validateResource.ts';
import {
  getPaquetes,
  getBilletera,
  createOrden,
  getOrdenesPendientes,
  aprobarOrden,
  rechazarOrden,
} from '../controllers/tokens.controller.ts';
import {
  ApproveOrdenSchema,
  RejectOrdenSchema,
  CreateOrdenSchema,
} from '../schema/tokens.schema.ts';

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
