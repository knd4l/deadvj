CREATE TABLE IF NOT EXISTS licencias_formato10 (
  licencias_formato10_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  licencias_formato10_nombre VARCHAR(100) NOT NULL,
  licencias_formato10_estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (licencias_formato10_id),
  UNIQUE KEY uq_licencias_formato10_nombre (licencias_formato10_nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO licencias_formato10 (licencias_formato10_nombre) VALUES
  ('CANVA'),
  ('PADLET'),
  ('MIRO'),
  ('FLIKI'),
  ('GENIALLY');
