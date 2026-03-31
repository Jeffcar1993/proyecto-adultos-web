import { Router } from 'express';
import { crearPerfil, getMisPerfiles, getPerfilById, getPerfiles } from '../controllers/perfil.controller.ts';
import { upload } from '../middlewares/multer.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const router = Router();

// Rutas de perfiles públicas
router.get('/', getPerfiles);
router.get('/mis-anuncios', authenticateToken, getMisPerfiles);
router.get('/:id', getPerfilById);

// Rutas de perfiles protegidas (requieren autenticación)
router.post('/', authenticateToken, upload.array('fotos', 5), crearPerfil);

export default router;