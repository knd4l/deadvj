ALTER TABLE anexos_formato1
  ADD COLUMN IF NOT EXISTS anexo_acta_trabajo_descripcion TEXT NULL AFTER anexo_acta_trabajo,
  ADD COLUMN IF NOT EXISTS anexo_acuerdo_calidad_ruta VARCHAR(500) NULL AFTER anexo_acuerdo_calidad,
  ADD COLUMN IF NOT EXISTS anexo_criterio_aceptacion_ruta VARCHAR(500) NULL AFTER anexo_criterio_aceptacion;
