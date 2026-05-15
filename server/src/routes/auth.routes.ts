import { Router } from 'express';
import {
	getMe,
	login,
	register,
	requestPasswordReset,
	resetPassword,
	googleAuth,
	deleteAccount
} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateResource } from '../middlewares/validateResource.js';
import {
	RegisterSchema,
	LoginSchema,
	RequestPasswordResetSchema,
	ResetPasswordSchema,
	GoogleAuthSchema,
} from '../schema/auth.schema.js';

const router = Router();

router.post('/register', validateResource(RegisterSchema), register);
router.post('/login', validateResource(LoginSchema), login);
router.post('/forgot-password', validateResource(RequestPasswordResetSchema), requestPasswordReset);
router.post('/reset-password', validateResource(ResetPasswordSchema), resetPassword);
router.post('/auth/google', validateResource(GoogleAuthSchema), googleAuth);
router.get('/me', authenticateToken, getMe);
router.delete('/me', authenticateToken, deleteAccount);

export default router;
