ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_banner ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_miniatura ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_zoom ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_articulo ENUM('SI', 'NO') NOT NULL DEFAULT 'NO',
  ADD COLUMN IF NOT EXISTS formato13_pagina_web_url VARCHAR(2048) NULL;