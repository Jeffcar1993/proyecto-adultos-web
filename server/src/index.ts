import express from 'express';
import cors from 'cors';
import pool from './config/db.ts';
import { migratePerfil } from './config/migrations.ts';
import perfilRoutes from './routes/perfil.routes.ts';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
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
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Prueba la conexión en: http://localhost:${PORT}/test-db`);
});

// Intentar migración con manejo de errores
migratePerfil()
  .then(() => {
    console.log('✅ Migración completada');
  })
  .catch((error) => {
    console.error('⚠️ Error en migración (continuando):', error.message);
    console.error('⚠️ Verifica tu conexión a Neon en: http://localhost:' + PORT + '/test-db');
  });

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
});