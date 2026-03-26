// server/src/config/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Definimos la interfaz del Perfil para que TS nos ayude luego
export interface Perfil {
  id?: number;
  nombre: string;
  descripcion: string;
  telefono: string;
  whatsapp: string;
  fotos: string[];       // Array de URLs de Cloudinary
  foto_principal: string;
  created_at?: Date;
}

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no está configurado en .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Neon Tech
  },
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10 segundos de timeout
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de connexiones:', err);
});

export default pool;