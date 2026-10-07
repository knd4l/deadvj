ALTER TABLE planificacion_contenidos_formato6
  ADD COLUMN IF NOT EXISTS contenido_padre_id INT NULL AFTER contenido,
  ADD COLUMN IF NOT EXISTS orden INT NOT NULL DEFAULT 0 AFTER contenido_padre_id;

CREATE INDEX IF NOT EXISTS idx_planificacion_formato_modulo_padre_orden
  ON planificacion_contenidos_formato6 (formato6_codigo, modulo_id, contenido_padre_id, orden);
