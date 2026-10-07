ALTER TABLE planificacion_contenidos_formato6
  ADD COLUMN IF NOT EXISTS modulo_nombre VARCHAR(255) NULL AFTER modulo_id;

UPDATE planificacion_contenidos_formato6 pc
INNER JOIN (
  SELECT formato6_codigo, modulo_id, modulo_nombre
  FROM (
    SELECT
      modulos.formato6_codigo,
      ROW_NUMBER() OVER (
        PARTITION BY modulos.formato6_codigo
        ORDER BY modulos.primer_horario_id
      ) AS modulo_id,
      modulos.modulo_nombre
    FROM (
      SELECT
        formato6_codigo,
        TRIM(modulo_nombre) AS modulo_nombre,
        MIN(horario_ejecucion_id) AS primer_horario_id
      FROM horario_ejecucion
      WHERE modulo_nombre IS NOT NULL
        AND TRIM(modulo_nombre) <> ''
      GROUP BY formato6_codigo, TRIM(modulo_nombre)
    ) modulos
  ) nombres
) origen
  ON origen.formato6_codigo = pc.formato6_codigo
  AND origen.modulo_id = pc.modulo_id
SET pc.modulo_nombre = origen.modulo_nombre
WHERE pc.modulo_nombre IS NULL;
