import { Router } from 'express';
import { getMe, login, register } from '../controllers/authController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

export default router;
