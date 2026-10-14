CREATE TABLE IF NOT EXISTS formato9 (
  formato9_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato6_codigo INT NOT NULL,
  formato9_modulo_id INT NOT NULL,
  formato9_textos LONGTEXT NOT NULL,
  formato9_fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formato9_codigo),
  KEY idx_formato9_formato6_modulo (formato6_codigo, formato9_modulo_id),
  CONSTRAINT fk_formato9_formato6 FOREIGN KEY (formato6_codigo)
    REFERENCES formato6 (formato6_codigo) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
