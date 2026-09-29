CREATE TABLE IF NOT EXISTS formato13 (
  formato13_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_linea_grafica_institucional ENUM('SI', 'NO') NOT NULL,
  formato13_alianza_convenio ENUM('SI', 'NO') NOT NULL,
  formato13_identificadores TEXT NULL,
  formato13_aspectos_considerar ENUM('SI', 'NO') NOT NULL,
  formato13_otros TEXT NULL,
  formato13_fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formato13_codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;