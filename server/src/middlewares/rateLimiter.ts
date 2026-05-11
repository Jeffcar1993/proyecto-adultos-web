import rateLimit from 'express-rate-limit';

// Rate limit general para todas las rutas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit estricto para autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP en 15 minutos
  message: 'Demasiados intentos de autenticación. Intenta en 15 minutos.',
  skipSuccessfulRequests: true, // No cuenta intentos exitosos
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit muy estricto para password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 intentos por IP en 1 hora
  message: 'Demasiados intentos de recuperación de contraseña. Intenta en 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
});
