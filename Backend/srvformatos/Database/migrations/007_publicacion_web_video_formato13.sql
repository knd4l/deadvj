ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_fecha_publicacion DATE NULL,
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL,
  ADD COLUMN IF NOT EXISTS formato13_video_fecha_publicacion DATE NULL,
  ADD COLUMN IF NOT EXISTS formato13_video_tipo_publicacion ENUM('PUBLICIDAD', 'INFORMATIVA') NULL;