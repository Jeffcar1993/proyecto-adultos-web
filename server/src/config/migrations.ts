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

    // 3. Agregar columna edad
    try {
      const checkEdad = await queryWithRetry(
        "SELECT column_name FROM information_schema.columns WHERE table_name='perfiles' AND column_name='edad';"
      );

      if (checkEdad.rows.length === 0) {
        await queryWithRetry(
          'ALTER TABLE perfiles ADD COLUMN edad INTEGER;'
        );
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo agregar edad:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. Agregar restricción de edad válida
    try {
      const checkEdadConstraint = await queryWithRetry(
        "SELECT conname FROM pg_constraint WHERE conrelid = 'perfiles'::regclass AND conname = 'perfiles_edad_check';"
      );

      if (checkEdadConstraint.rows.length === 0) {
        await queryWithRetry(
          'ALTER TABLE perfiles ADD CONSTRAINT perfiles_edad_check CHECK (edad IS NULL OR (edad >= 18 AND edad <= 99));'
        );
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo agregar restricción de edad:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. Eliminar restricción que limita a un anuncio por usuario
    try {
      const checkUniqueUsuarioPerfil = await queryWithRetry(
        "SELECT conname FROM pg_constraint WHERE conrelid = 'perfiles'::regclass AND conname = 'unique_usuario_perfil';"
      );

      if (checkUniqueUsuarioPerfil.rows.length > 0) {
        await queryWithRetry('ALTER TABLE perfiles DROP CONSTRAINT unique_usuario_perfil;');
        changesApplied++;
      }
    } catch (error) {
      console.log("⚠️ No se pudo eliminar unique_usuario_perfil:", (error as Error).message);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // 6. Crear índice departamento
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

    // 7. Crear índice ciudad
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

    // 8. Crear índice barrio
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

export async function migrateUsuarios() {
  try {
    let changesApplied = 0;

    await queryWithRetry(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const checkNombre = await queryWithRetry(
      "SELECT column_name FROM information_schema.columns WHERE table_name='usuarios' AND column_name='nombre';"
    );

    if (checkNombre.rows.length === 0) {
      await queryWithRetry("ALTER TABLE usuarios ADD COLUMN nombre VARCHAR(120);");
      changesApplied++;
    }

    await queryWithRetry("UPDATE usuarios SET nombre = split_part(email, '@', 1) WHERE nombre IS NULL OR TRIM(nombre) = '';");

    const checkResetToken = await queryWithRetry(
      "SELECT column_name FROM information_schema.columns WHERE table_name='usuarios' AND column_name='reset_token';"
    );

    if (checkResetToken.rows.length === 0) {
      await queryWithRetry("ALTER TABLE usuarios ADD COLUMN reset_token TEXT;");
      changesApplied++;
    }

    const checkResetTokenExpires = await queryWithRetry(
      "SELECT column_name FROM information_schema.columns WHERE table_name='usuarios' AND column_name='reset_token_expires';"
    );

    if (checkResetTokenExpires.rows.length === 0) {
      await queryWithRetry("ALTER TABLE usuarios ADD COLUMN reset_token_expires TIMESTAMPTZ;");
      changesApplied++;
    }

    if (changesApplied > 0) {
      console.log(`✅ Migración usuarios aplicada: ${changesApplied}`);
    }
  } catch (error) {
    console.error('❌ Error en migración de usuarios:', error);
  }
}
