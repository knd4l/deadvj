ALTER TABLE formato32
  ADD COLUMN formato6_codigo INT NULL AFTER instructor_apellidos,
  ADD KEY idx_formato32_formato6_codigo (formato6_codigo),
  ADD CONSTRAINT fk_formato32_formato6 FOREIGN KEY (formato6_codigo)
    REFERENCES formato6 (formato6_codigo) ON DELETE RESTRICT ON UPDATE CASCADE;
