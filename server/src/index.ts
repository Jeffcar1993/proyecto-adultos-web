import express from 'express';
import cors from 'cors';
import pool from './config/db.ts';
import perfilRoutes from './routes/perfil.routes.ts';
import authRoutes from './routes/auth.routes.ts';
import tokensRoutes from './routes/tokens.routes.ts';
import { generalLimiter, authLimiter, passwordResetLimiter } from './middlewares/rateLimiter.ts';

const app = express();

const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, '');
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

// Configuración CORS restrictiva
const corsOptions = {
  origin: (requestOrigin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!requestOrigin) {
      return callback(null, true);
    }

    const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
    const isAllowed = allowedOrigins.includes(normalizedRequestOrigin);

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${requestOrigin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting global
app.use(generalLimiter);

// Rutas con limitadores específicos
app.post('/api/register', authLimiter);
app.post('/api/login', authLimiter);
app.post('/api/forgot-password', passwordResetLimiter);
app.post('/api/reset-password', authLimiter);
app.post('/api/auth/google', authLimiter);

app.use('/api', authRoutes);
app.use('/api', tokensRoutes);
app.use('/api/perfiles', perfilRoutes);

const PORT = process.env.PORT || 3001;

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Conexión exitosa', time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error conectando a la DB' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📝 Nota: Para ejecutar migraciones, usa: npm run migrate');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
});