ALTER TABLE formato32
  ADD COLUMN formato32_grupo_codigo CHAR(32) NULL AFTER formato32_codigo,
  ADD KEY idx_formato32_grupo_codigo (formato32_grupo_codigo);

UPDATE formato32 registro
INNER JOIN (
  SELECT instructor_identificacion, formato6_codigo, fecha_creacion
  FROM formato32
  WHERE formato32_grupo_codigo IS NULL
    AND formato6_codigo IS NOT NULL
  GROUP BY instructor_identificacion, formato6_codigo, fecha_creacion
  HAVING COUNT(*) > 1
) grupo
  ON grupo.instructor_identificacion = registro.instructor_identificacion
  AND grupo.formato6_codigo = registro.formato6_codigo
  AND grupo.fecha_creacion = registro.fecha_creacion
SET registro.formato32_grupo_codigo = MD5(CONCAT(
  registro.instructor_identificacion,
  '|',
  registro.formato6_codigo,
  '|',
  DATE_FORMAT(registro.fecha_creacion, '%Y-%m-%d %H:%i:%s')
))
WHERE registro.formato32_grupo_codigo IS NULL;
