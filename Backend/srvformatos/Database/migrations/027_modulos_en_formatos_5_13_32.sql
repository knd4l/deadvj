ALTER TABLE formato5
  ADD COLUMN IF NOT EXISTS formato5_modulo_id INT NULL AFTER formato6_codigo;

ALTER TABLE formato13
  ADD COLUMN IF NOT EXISTS formato13_modulo_id INT NULL AFTER formato6_codigo;

ALTER TABLE formato32
  ADD COLUMN IF NOT EXISTS formato32_modulo_id INT NULL AFTER formato6_codigo;
