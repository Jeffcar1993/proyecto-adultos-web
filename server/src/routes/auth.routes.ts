import { Router } from 'express';
import { getMe, login, register, requestPasswordReset, resetPassword } from '../controllers/authController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getMe);

export default router;
