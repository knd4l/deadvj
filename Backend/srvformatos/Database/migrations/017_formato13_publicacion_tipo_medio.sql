CREATE TABLE IF NOT EXISTS formato13_tipo_medio (
  tipo_medio_codigo SMALLINT UNSIGNED NOT NULL,
  tipo_medio_nombre VARCHAR(25) NOT NULL,
  PRIMARY KEY (tipo_medio_codigo),
  UNIQUE KEY uq_formato13_tipo_medio_nombre (tipo_medio_nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO formato13_tipo_medio (tipo_medio_codigo, tipo_medio_nombre) VALUES
  (1, 'Facebook'),
  (2, 'WhatsApp'),
  (3, 'X'),
  (4, 'LinkedIn')
ON DUPLICATE KEY UPDATE tipo_medio_nombre = VALUES(tipo_medio_nombre);

CREATE TABLE IF NOT EXISTS formato13_publicacion (
  publicacion_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_codigo BIGINT UNSIGNED NOT NULL,
  orden_publicacion INT UNSIGNED NOT NULL,
  tipo_medio_codigo SMALLINT UNSIGNED NULL,
  tipo_medio_nombre VARCHAR(25) NULL,
  fecha_publicacion DATE NULL,
  url_publicacion VARCHAR(2048) NULL,
  tipo_recurso LONGTEXT NULL,
  tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  medio_uta ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  medio_uta_url VARCHAR(2048) NULL,
  impreso ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  copias_impresas INT UNSIGNED NULL,
  publicaciones_legacy LONGTEXT NULL,
  PRIMARY KEY (publicacion_codigo),
  UNIQUE KEY uq_formato13_publicacion_orden (formato13_codigo, orden_publicacion),
  CONSTRAINT fk_formato13_publicacion_formato FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_formato13_publicacion_tipo_medio FOREIGN KEY (tipo_medio_codigo)
    REFERENCES formato13_tipo_medio (tipo_medio_codigo) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @tiene_publicaciones_legacy = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = 'formato13_publicaciones'
);

SET @migrar_publicaciones_legacy = IF(
  @tiene_publicaciones_legacy > 0,
  'INSERT IGNORE INTO formato13_publicacion (formato13_codigo, orden_publicacion, tipo_medio_codigo, tipo_medio_nombre, fecha_publicacion, url_publicacion, tipo_recurso, tipo_publicacion, medio_uta, medio_uta_url, impreso, copias_impresas, publicaciones_legacy) SELECT antigua.formato13_codigo, antigua.orden_publicacion, medio.tipo_medio_codigo, antigua.tipo_medio, antigua.fecha_publicacion, antigua.url_publicacion, antigua.tipo_recurso, antigua.tipo_publicacion, antigua.medio_uta, antigua.medio_uta_url, antigua.impreso, antigua.copias_impresas, antigua.publicaciones_legacy FROM formato13_publicaciones antigua LEFT JOIN formato13_tipo_medio medio ON medio.tipo_medio_nombre = antigua.tipo_medio',
  'SELECT 1'
);
PREPARE migrar_publicaciones FROM @migrar_publicaciones_legacy;
EXECUTE migrar_publicaciones;
DEALLOCATE PREPARE migrar_publicaciones;

INSERT IGNORE INTO formato13_publicacion (
  formato13_codigo,
  orden_publicacion,
  tipo_medio_codigo,
  tipo_medio_nombre
)
SELECT
  formato.formato13_codigo,
  1,
  medio.tipo_medio_codigo,
  formato.tipo_medio
FROM formato13 formato
LEFT JOIN formato13_tipo_medio medio
  ON medio.tipo_medio_nombre = formato.tipo_medio;