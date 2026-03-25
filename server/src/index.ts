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

app.listen(PORT, async () => {
  try {
    await migratePerfil();
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error iniciando servidor:", error);
    process.exit(1);
  }
});