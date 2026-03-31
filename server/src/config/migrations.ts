import pool from '../config/db.ts';

// Función auxiliar para hacer reintentos en conexiones
async function queryWithRetry(queryStr: string, params: unknown[] = [], retries = 3) {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(queryStr, params);
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError || new Error('Query failed after retries');
}

export async function migratePerfil() {
  try {
    let changesApplied = 0;
    
    // Verificar que la tabla existe
    try {
      await queryWithRetry(
        "SELECT 1 FROM information_schema.tables WHERE table_name='perfiles';"
      );
    } catch (error) {
      console.log('❌ Tabla perfiles no existe. Crea la tabla en Neon manualmente.');
      return;
    }

    // Esperar un poco antes de empezar
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Agregar columna departamento
    try {
      const checkDepartamento = await queryWithRetry(
        "SELECT column_name FROM information_schema.columns WHERE table_name='perfiles' AND column_name='departamento';"
      );

      if (checkDepartamento.rows.length === 0) {
        await queryWithRetry(
          "ALTER TABLE perfiles ADD COLUMN departamento VARCHAR(100);"
        );
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo agregar departamento:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Agregar columna barrio
    try {
      const checkBarrio = await queryWithRetry(
        "SELECT column_name FROM information_schema.columns WHERE table_name='perfiles' AND column_name='barrio';"
      );

      if (checkBarrio.rows.length === 0) {
        await queryWithRetry(
          "ALTER TABLE perfiles ADD COLUMN barrio VARCHAR(100);"
        );
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo agregar barrio:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Crear índice departamento
    try {
      const checkIndexDep = await queryWithRetry(
        `SELECT indexname FROM pg_indexes WHERE tablename='perfiles' AND indexname='idx_perfiles_departamento';`
      );

      if (checkIndexDep.rows.length === 0) {
        await queryWithRetry("CREATE INDEX idx_perfiles_departamento ON perfiles(departamento);");
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo crear índice departamento:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. Crear índice ciudad
    try {
      const checkIndexCity = await queryWithRetry(
        `SELECT indexname FROM pg_indexes WHERE tablename='perfiles' AND indexname='idx_perfiles_ciudad';`
      );

      if (checkIndexCity.rows.length === 0) {
        await queryWithRetry("CREATE INDEX idx_perfiles_ciudad ON perfiles(ciudad);");
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo crear índice ciudad:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. Crear índice barrio
    try {
      const checkIndexBarrio = await queryWithRetry(
        `SELECT indexname FROM pg_indexes WHERE tablename='perfiles' AND indexname='idx_perfiles_barrio';`
      );

      if (checkIndexBarrio.rows.length === 0) {
        await queryWithRetry("CREATE INDEX idx_perfiles_barrio ON perfiles(barrio);");
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo crear índice barrio:", (error as Error).message);
    }

    if (changesApplied > 0) {
      console.log(`✅ Migraciones aplicadas: ${changesApplied}`);
    }
  } catch (error) {
    console.error("❌ Error crítico en migración:", error);
  }
}
