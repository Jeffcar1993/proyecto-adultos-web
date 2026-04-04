import express from 'express';
import cors from 'cors';
import pool from './config/db.ts';
import { migratePerfil, migrateUsuarios, migrateTokens } from './config/migrations.ts';
import perfilRoutes from './routes/perfil.routes.ts';
import authRoutes from './routes/auth.routes.ts';
import tokensRoutes from './routes/tokens.routes.ts';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
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
});

// Intentar migración con manejo de errores
migrateUsuarios()
  .then(() => migratePerfil())
  .then(() => migrateTokens())
  .then(() => undefined)
  .catch((error) => {
    console.error('⚠️ Error en migración (continuando):', error.message);
  });

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
});