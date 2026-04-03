import { Router } from 'express';
import { getMe, login, register, requestPasswordReset, resetPassword, googleAuth } from '../controllers/authController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/auth/google', googleAuth);
router.get('/me', authenticateToken, getMe);

export default router;
