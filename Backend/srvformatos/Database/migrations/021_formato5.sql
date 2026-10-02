CREATE TABLE IF NOT EXISTS formato5 (
  formato5_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato6_codigo INT NOT NULL,
  formato5_cedula VARCHAR(20) NOT NULL,
  formato5_nombres VARCHAR(150) NOT NULL,
  formato5_apellidos VARCHAR(150) NOT NULL,
  formato5_dominio_tematica DECIMAL(10, 2) NOT NULL,
  formato5_dominio_aula DECIMAL(10, 2) NOT NULL,
  formato5_habilidades_blandas DECIMAL(10, 2) NOT NULL,
  formato5_nota_entrevista DECIMAL(10, 2) NOT NULL,
  formato5_observaciones TEXT NULL,
  formato5_fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formato5_codigo),
  KEY idx_formato5_formato6_codigo (formato6_codigo),
  CONSTRAINT fk_formato5_formato6 FOREIGN KEY (formato6_codigo)
    REFERENCES formato6 (formato6_codigo) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;