CREATE TABLE IF NOT EXISTS formato13_publicacion_pagina_web (
  publicacion_pagina_web_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_codigo BIGINT UNSIGNED NOT NULL,
  orden_publicacion INT UNSIGNED NOT NULL,
  fecha_publicacion DATE NULL,
  tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  banner ENUM('SI', 'NO') NULL,
  miniatura ENUM('SI', 'NO') NULL,
  zoom ENUM('SI', 'NO') NULL,
  articulo ENUM('SI', 'NO') NULL,
  url VARCHAR(2048) NULL,
  PRIMARY KEY (publicacion_pagina_web_codigo),
  UNIQUE KEY uq_f13_web_orden (formato13_codigo, orden_publicacion),
  CONSTRAINT fk_f13_web_publicacion FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato13_publicacion_red_social (
  publicacion_red_social_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_codigo BIGINT UNSIGNED NOT NULL,
  orden_publicacion INT UNSIGNED NOT NULL,
  fecha_publicacion DATE NULL,
  tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  post ENUM('SI', 'NO') NULL,
  post_url VARCHAR(2048) NULL,
  carrusel ENUM('SI', 'NO') NULL,
  carrusel_url VARCHAR(2048) NULL,
  reel ENUM('SI', 'NO') NULL,
  reel_url VARCHAR(2048) NULL,
  otro TEXT NULL,
  url_red_social VARCHAR(2048) NULL,
  PRIMARY KEY (publicacion_red_social_codigo),
  UNIQUE KEY uq_f13_social_orden (formato13_codigo, orden_publicacion),
  CONSTRAINT fk_f13_social_publicacion FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato13_publicacion_video (
  publicacion_video_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_codigo BIGINT UNSIGNED NOT NULL,
  orden_publicacion INT UNSIGNED NOT NULL,
  fecha_publicacion DATE NULL,
  tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  television ENUM('SI', 'NO') NULL,
  video_45s ENUM('VIVENCIAL', 'INFORMATIVO', 'NO') NULL,
  video_2_min ENUM('SI', 'NO') NULL,
  video_2_min_explicacion TEXT NULL,
  url_red_social VARCHAR(2048) NULL,
  PRIMARY KEY (publicacion_video_codigo),
  UNIQUE KEY uq_f13_video_orden (formato13_codigo, orden_publicacion),
  CONSTRAINT fk_f13_video_publicacion FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato13_publicacion_medio_uta (
  medio_uta_publicacion_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  formato13_codigo BIGINT UNSIGNED NOT NULL,
  orden_publicacion INT UNSIGNED NOT NULL,
  fecha_publicacion DATE NULL,
  url VARCHAR(2048) NULL,
  PRIMARY KEY (medio_uta_publicacion_codigo),
  UNIQUE KEY uq_f13_medio_uta_orden (formato13_codigo, orden_publicacion),
  CONSTRAINT fk_f13_medio_uta_publicacion FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;