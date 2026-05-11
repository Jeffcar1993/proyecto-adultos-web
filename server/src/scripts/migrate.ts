import { migrateUsuarios, migratePerfil, migrateTokens } from '../config/migrations.ts';

async function runMigrations() {
  console.log('🔄 Iniciando migraciones...');
  
  try {
    await migrateUsuarios();
    console.log('✅ Usuarios migrados');
    
    await migratePerfil();
    console.log('✅ Perfiles migrados');
    
    await migrateTokens();
    console.log('✅ Tokens migrados');
    
    console.log('✅ Todas las migraciones completadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante migraciones:', error);
    process.exit(1);
  }
}

runMigrations();
