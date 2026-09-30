CREATE TABLE IF NOT EXISTS formato13_pagina_web (
  pagina_web_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha_publicacion DATE NULL,
  tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  banner ENUM('SI', 'NO') NULL,
  miniatura ENUM('SI', 'NO') NULL,
  zoom ENUM('SI', 'NO') NULL,
  articulo ENUM('SI', 'NO') NULL,
  url VARCHAR(2048) NULL,
  publicaciones_adicionales LONGTEXT NULL,
  PRIMARY KEY (pagina_web_codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato13_red_social (
  red_social_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
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
  publicaciones_adicionales LONGTEXT NULL,
  PRIMARY KEY (red_social_codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato13_videos (
  video_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha_publicacion DATE NULL,
  tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  television ENUM('SI', 'NO') NULL,
  video_45s ENUM('VIVENCIAL', 'INFORMATIVO', 'NO') NULL,
  video_2_min ENUM('SI', 'NO') NULL,
  video_2_min_explicacion TEXT NULL,
  url_red_social VARCHAR(2048) NULL,
  publicaciones_adicionales LONGTEXT NULL,
  PRIMARY KEY (video_codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS formato13_medio_uta (
  medio_uta_codigo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha_publicacion DATE NULL,
  url VARCHAR(2048) NULL,
  publicaciones_adicionales LONGTEXT NULL,
  PRIMARY KEY (medio_uta_codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_codigo BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_codigo BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS formato13_video_codigo BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS formato13_medio_uta_codigo BIGINT UNSIGNED NULL;

ALTER TABLE formato13
  ADD UNIQUE KEY uq_formato13_pagina_web_codigo (formato13_pagina_web_codigo),
  ADD UNIQUE KEY uq_formato13_red_social_codigo (formato13_red_social_codigo),
  ADD UNIQUE KEY uq_formato13_video_codigo (formato13_video_codigo),
  ADD UNIQUE KEY uq_formato13_medio_uta_codigo (formato13_medio_uta_codigo),
  ADD CONSTRAINT fk_formato13_pagina_web FOREIGN KEY (formato13_pagina_web_codigo)
    REFERENCES formato13_pagina_web (pagina_web_codigo) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT fk_formato13_red_social FOREIGN KEY (formato13_red_social_codigo)
    REFERENCES formato13_red_social (red_social_codigo) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT fk_formato13_video FOREIGN KEY (formato13_video_codigo)
    REFERENCES formato13_videos (video_codigo) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT fk_formato13_medio_uta FOREIGN KEY (formato13_medio_uta_codigo)
    REFERENCES formato13_medio_uta (medio_uta_codigo) ON DELETE RESTRICT ON UPDATE CASCADE;