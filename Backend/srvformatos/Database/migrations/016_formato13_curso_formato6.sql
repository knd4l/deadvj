ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato6_codigo INT NULL,
  ADD INDEX IF NOT EXISTS idx_formato13_formato6_codigo (formato6_codigo);

ALTER TABLE formato13
  ADD CONSTRAINT fk_formato13_formato6 FOREIGN KEY (formato6_codigo)
    REFERENCES formato6 (formato6_codigo) ON DELETE SET NULL ON UPDATE CASCADE;