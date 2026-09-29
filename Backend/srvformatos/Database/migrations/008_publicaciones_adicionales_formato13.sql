ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_adicionales LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS formato13_red_social_adicionales LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS formato13_video_adicionales LONGTEXT NULL;