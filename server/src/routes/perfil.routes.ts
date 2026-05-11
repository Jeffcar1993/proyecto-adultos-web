import { Router } from 'express';
import {
	crearPerfil,
	eliminarPerfil,
	getMisPerfiles,
	getPerfilById,
	getPerfiles,
	subirPerfil,
	verificarPerfil,
} from '../controllers/perfil.controller.ts';
import { upload } from '../middlewares/multer.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';
import { validateResource } from '../middlewares/validateResource.ts';
import {
	CreatePerfilSchema,
	VerifyPerfilSchema,
	UploadPerfilSchema,
	DeletePerfilSchema,
	GetPerfilSchema,
} from '../schema/perfil.schema.ts';

const router = Router();

// Rutas de perfiles públicas
router.get('/', getPerfiles);
router.get('/mis-anuncios', authenticateToken, getMisPerfiles);
router.get('/:id', validateResource(GetPerfilSchema), getPerfilById);

// Rutas de perfiles protegidas (requieren autenticación)
router.post(
	'/',
	authenticateToken,
	upload.array('fotos', 5),
	validateResource(CreatePerfilSchema),
	crearPerfil
);
router.delete(
	'/:id',
	authenticateToken,
	validateResource(DeletePerfilSchema),
	eliminarPerfil
);
router.post(
	'/:id/subir',
	authenticateToken,
	validateResource(UploadPerfilSchema),
	subirPerfil
);
router.post(
	'/:id/verificar',
	authenticateToken,
	validateResource(VerifyPerfilSchema),
	verificarPerfil
);

export default router;