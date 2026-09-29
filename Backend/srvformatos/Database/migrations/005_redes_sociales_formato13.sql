ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_red_social_fecha_publicacion DATE NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_post ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_red_social_post_url VARCHAR(2048) NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_carrusel ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_red_social_carrusel_url VARCHAR(2048) NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_reel ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_red_social_reel_url VARCHAR(2048) NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_otro TEXT NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_url VARCHAR(2048) NULL;