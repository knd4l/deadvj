UPDATE formato1 AS f1
INNER JOIN modalidad_capacitacion AS mc
  ON CAST(f1.formato1_modalidad AS UNSIGNED) = mc.modalidad_codigo
SET f1.formato1_modalidad = CASE UPPER(mc.modalidad_nombre)
  WHEN 'B-LEARNING' THEN 'B-learning'
  WHEN 'E-LEARNING' THEN 'E-learning'
  ELSE mc.modalidad_nombre
END
WHERE f1.formato1_modalidad REGEXP '^[0-9]+$';