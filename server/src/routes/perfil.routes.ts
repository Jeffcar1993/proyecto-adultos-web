import { Router } from 'express';
import { createPerfil, getPerfilById, getPerfiles } from '../controllers/perfil.controller.ts';
import { upload } from '../middlewares/multer.ts';

const router = Router();

// 'fotos' es el nombre del campo que deberá enviar el frontend
router.post('/', upload.array('fotos', 5), createPerfil);

router.get('/', getPerfiles);
router.get('/:id', getPerfilById);

export default router;