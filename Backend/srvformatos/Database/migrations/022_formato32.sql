CREATE TABLE IF NOT EXISTS formato32 (
  formato32_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  instructor_identificacion VARCHAR(52) NOT NULL,
  instructor_nombres VARCHAR(150) NOT NULL,
  instructor_apellidos VARCHAR(150) NOT NULL,
  fecha_notificacion DATE NOT NULL,
  tipo_notificacion ENUM('individual', 'grupal') NOT NULL,
  nombres_notificado VARCHAR(150) NULL,
  apellidos_notificado VARCHAR(150) NULL,
  medio_notificacion VARCHAR(100) NOT NULL,
  detalle TEXT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formato32_codigo),
  KEY idx_formato32_instructor (instructor_identificacion),
  KEY idx_formato32_fecha (fecha_notificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
