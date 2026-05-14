import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta ${name} en variables de entorno. Configura ${name} antes de iniciar el servidor.`);
  }
  return value;
}

const jwtSecret: string = getRequiredEnv('JWT_SECRET');

export { jwtSecret };