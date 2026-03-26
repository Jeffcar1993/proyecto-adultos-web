import { Router } from 'express';
import { crearPerfil, getPerfilById, getPerfiles } from '../controllers/perfil.controller.ts';
import { upload } from '../middlewares/multer.ts';
import { login, register } from '../controllers/authController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const router = Router();

// Rutas de autenticación (sin protección)
router.post('/register', register);
router.post('/login', login);

// Rutas de perfiles públicas
router.get('/', getPerfiles);
router.get('/:id', getPerfilById);

// Rutas de perfiles protegidas (requieren autenticación)
router.post('/', authenticateToken, upload.array('fotos', 5), crearPerfil);

export default router;