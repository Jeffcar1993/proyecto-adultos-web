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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Neon Tech
  },
});

export default pool;