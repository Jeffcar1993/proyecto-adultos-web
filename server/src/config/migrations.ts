import pool from '../config/db.ts';

export async function migratePerfil() {
  try {
    // Verificar si existen las columnas, si no las crea
    const checkDepartamento = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='perfiles' AND column_name='departamento';"
    );

    if (checkDepartamento.rows.length === 0) {
      console.log("Agregando columna 'departamento' a la tabla perfiles...");
      await pool.query(
        "ALTER TABLE perfiles ADD COLUMN departamento VARCHAR(100);"
      );
      console.log("✅ Columna 'departamento' agregada");
    }

    const checkBarrio = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='perfiles' AND column_name='barrio';"
    );

    if (checkBarrio.rows.length === 0) {
      console.log("Agregando columna 'barrio' a la tabla perfiles...");
      await pool.query(
        "ALTER TABLE perfiles ADD COLUMN barrio VARCHAR(100);"
      );
      console.log("✅ Columna 'barrio' agregada");
    }

    // Crear índices para búsqueda rápida
    const checkIndexDep = await pool.query(
      `SELECT indexname FROM pg_indexes WHERE tablename='perfiles' AND indexname='idx_perfiles_departamento';`
    );

    if (checkIndexDep.rows.length === 0) {
      await pool.query("CREATE INDEX idx_perfiles_departamento ON perfiles(departamento);");
      console.log("✅ Índice en departamento creado");
    }

    const checkIndexCity = await pool.query(
      `SELECT indexname FROM pg_indexes WHERE tablename='perfiles' AND indexname='idx_perfiles_ciudad';`
    );

    if (checkIndexCity.rows.length === 0) {
      await pool.query("CREATE INDEX idx_perfiles_ciudad ON perfiles(ciudad);");
      console.log("✅ Índice en ciudad creado");
    }

    const checkIndexBarrio = await pool.query(
      `SELECT indexname FROM pg_indexes WHERE tablename='perfiles' AND indexname='idx_perfiles_barrio';`
    );

    if (checkIndexBarrio.rows.length === 0) {
      await pool.query("CREATE INDEX idx_perfiles_barrio ON perfiles(barrio);");
      console.log("✅ Índice en barrio creado");
    }

    console.log("✅ Migración completada");
  } catch (error) {
    console.error("❌ Error en migración:", error);
  }
}
