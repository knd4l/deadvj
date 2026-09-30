ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS fecha_publicacion DATE NULL,
  ADD COLUMN IF NOT EXISTS url_publicacion VARCHAR(2048) NULL,
  ADD COLUMN IF NOT EXISTS tipo_recurso LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  ADD COLUMN IF NOT EXISTS medio_uta ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS medio_uta_url VARCHAR(2048) NULL,
  ADD COLUMN IF NOT EXISTS impreso ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS copias_impresas INT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS publicaciones_adicionales LONGTEXT NULL;

CREATE TABLE IF NOT EXISTS formato13_publicaciones (
  publicacion_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_codigo BIGINT UNSIGNED NOT NULL,
  orden_publicacion INT UNSIGNED NOT NULL,
  tipo_medio VARCHAR(25) NULL,
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
  CONSTRAINT fk_formato13_publicaciones_formato FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO formato13_publicaciones (
  formato13_codigo,
  orden_publicacion,
  tipo_medio,
  fecha_publicacion,
  url_publicacion,
  tipo_recurso,
  tipo_publicacion,
  medio_uta,
  medio_uta_url,
  impreso,
  copias_impresas,
  publicaciones_legacy
)
SELECT
  formato13_codigo,
  1,
  tipo_medio,
  fecha_publicacion,
  url_publicacion,
  tipo_recurso,
  tipo_publicacion,
  medio_uta,
  medio_uta_url,
  impreso,
  copias_impresas,
  publicaciones_adicionales
FROM formato13;

ALTER TABLE formato13
  DROP COLUMN IF EXISTS fecha_publicacion,
  DROP COLUMN IF EXISTS url_publicacion,
  DROP COLUMN IF EXISTS tipo_recurso,
  DROP COLUMN IF EXISTS tipo_publicacion,
  DROP COLUMN IF EXISTS medio_uta,
  DROP COLUMN IF EXISTS medio_uta_url,
  DROP COLUMN IF EXISTS impreso,
  DROP COLUMN IF EXISTS copias_impresas,
  DROP COLUMN IF EXISTS publicaciones_adicionales;