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

function normalizeDatabaseUrl(databaseUrl: string) {
  try {
    const parsedUrl = new URL(databaseUrl);

    // Neon ya usa TLS y el cliente recibe la configuración SSL explícitamente abajo.
    // Quitamos sslmode para evitar el warning emitido por pg-connection-string.
    parsedUrl.searchParams.delete('sslmode');
    parsedUrl.searchParams.delete('uselibpqcompat');

    return parsedUrl.toString();
  } catch {
    return databaseUrl;
  }
}

const pool = new Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
  ssl: {
    rejectUnauthorized: false, // Necesario para Neon Tech
  },
  min: 0,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000, // 10 segundos de timeout
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de connexiones:', err);
});

export default pool;