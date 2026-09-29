ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_medio_uta_fecha_publicacion DATE NULL,
  ADD COLUMN IF NOT EXISTS formato13_medio_uta_url VARCHAR(2048) NULL;