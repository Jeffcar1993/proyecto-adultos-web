import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Falta JWT_SECRET en variables de entorno. Configura JWT_SECRET antes de iniciar el servidor.');
}

export { jwtSecret };