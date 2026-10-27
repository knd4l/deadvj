CREATE TABLE IF NOT EXISTS formato10 (
  formato10_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato6_codigo INT NOT NULL,
  formato10_curso_codigo VARCHAR(100) NULL,
  formato10_curso_nombre VARCHAR(255) NOT NULL,
  formato10_instructor_cedula VARCHAR(52) NOT NULL,
  formato10_instructor_nombres VARCHAR(150) NOT NULL,
  formato10_instructor_apellidos VARCHAR(150) NOT NULL,
  formato10_detalle_uso TEXT NOT NULL,
  formato10_fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formato10_codigo),
  KEY idx_formato10_formato6_codigo (formato6_codigo),
  CONSTRAINT fk_formato10_formato6 FOREIGN KEY (formato6_codigo)
    REFERENCES formato6 (formato6_codigo) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato10_licencias (
  formato10_codigo BIGINT UNSIGNED NOT NULL,
  licencias_formato10_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (formato10_codigo, licencias_formato10_id),
  CONSTRAINT fk_formato10_licencias_formato10 FOREIGN KEY (formato10_codigo)
    REFERENCES formato10 (formato10_codigo) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_formato10_licencias_licencia FOREIGN KEY (licencias_formato10_id)
    REFERENCES licencias_formato10 (licencias_formato10_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
