ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato1_codigo_curso VARCHAR(50) NULL;

UPDATE formato13 AS f13
INNER JOIN formato6 AS f6
  ON f6.formato6_codigo = f13.formato6_codigo
INNER JOIN formato1 AS f1
  ON f1.formato1_codigo = f6.formato1_codigo
SET f13.formato1_codigo_curso = f1.formato1_codigo_curso
WHERE f13.formato1_codigo_curso IS NULL;