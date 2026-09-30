ALTER TABLE formato13_pagina_web
  ADD COLUMN IF NOT EXISTS formato13_codigo BIGINT UNSIGNED NULL,
  ADD INDEX IF NOT EXISTS idx_f13_pagina_web_formato (formato13_codigo);

ALTER TABLE formato13_red_social
  ADD COLUMN IF NOT EXISTS formato13_codigo BIGINT UNSIGNED NULL,
  ADD INDEX IF NOT EXISTS idx_f13_red_social_formato (formato13_codigo);

ALTER TABLE formato13_videos
  ADD COLUMN IF NOT EXISTS formato13_codigo BIGINT UNSIGNED NULL,
  ADD INDEX IF NOT EXISTS idx_f13_videos_formato (formato13_codigo);

ALTER TABLE formato13_medio_uta
  ADD COLUMN IF NOT EXISTS formato13_codigo BIGINT UNSIGNED NULL,
  ADD INDEX IF NOT EXISTS idx_f13_medio_uta_formato (formato13_codigo);

UPDATE formato13_pagina_web cuadro
INNER JOIN formato13 formato ON formato.formato13_pagina_web_codigo = cuadro.pagina_web_codigo
SET cuadro.formato13_codigo = formato.formato13_codigo;

UPDATE formato13_red_social cuadro
INNER JOIN formato13 formato ON formato.formato13_red_social_codigo = cuadro.red_social_codigo
SET cuadro.formato13_codigo = formato.formato13_codigo;

UPDATE formato13_videos cuadro
INNER JOIN formato13 formato ON formato.formato13_video_codigo = cuadro.video_codigo
SET cuadro.formato13_codigo = formato.formato13_codigo;

UPDATE formato13_medio_uta cuadro
INNER JOIN formato13 formato ON formato.formato13_medio_uta_codigo = cuadro.medio_uta_codigo
SET cuadro.formato13_codigo = formato.formato13_codigo;

ALTER TABLE formato13_pagina_web
  ADD CONSTRAINT fk_f13_pagina_web_formato FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE formato13_red_social
  ADD CONSTRAINT fk_f13_red_social_formato FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE formato13_videos
  ADD CONSTRAINT fk_f13_videos_formato FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE formato13_medio_uta
  ADD CONSTRAINT fk_f13_medio_uta_formato FOREIGN KEY (formato13_codigo)
    REFERENCES formato13 (formato13_codigo) ON DELETE CASCADE ON UPDATE CASCADE;