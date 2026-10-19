import { FormatonueveverComponent } from './formatonuevever.component';

describe('FormatonueveverComponent', () => {
  let component: FormatonueveverComponent;

  beforeEach(() => {
    component = new FormatonueveverComponent(null as any);
  });

  it('bolds only the ordinal heading from PRIMERA through DÉCIMA QUINTA', () => {
    const ordinales = [
      'PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA',
      'SEXTA', 'SÉPTIMA', 'OCTAVA', 'NOVENA', 'DÉCIMA',
      'DÉCIMA PRIMERA', 'DÉCIMA SEGUNDA', 'DÉCIMA TERCERA',
      'DÉCIMA CUARTA', 'DÉCIMA QUINTA'
    ];

    ordinales.forEach((ordinal) => {
      const contenido = component['formatearTextoContrato'](`${ordinal}.- El resto del texto queda normal.`, '', 0);
      expect(contenido.filter((fragmento) => fragmento.bold).map((fragmento) => fragmento.text))
        .toEqual([ordinal]);
      expect(contenido.map((fragmento) => fragmento.text).join(''))
        .toBe(`${ordinal}.- El resto del texto queda normal.`);
    });
  });

  it('does not bold ordinal words when they are not at the beginning of the text', () => {
    const texto = 'El contenido menciona la primera cláusula sin ser un encabezado.';
    const contenido = component['formatearTextoContrato'](texto, '', 0);

    expect(contenido).toEqual([{ text: texto }]);
  });

  it('bolds the defined course, clause three reference, amount, and hours in clause four', () => {
    const texto = 'CUARTA.- Pagará al profesional Curso de Prueba; USD 20,00 por las 60 horas. Ver CLÁUSULA TERCERA.';
    const contenido = component['formatearTextoContrato'](texto, 'Curso de Prueba', 4);
    const fragmentosNegrita = contenido.filter((fragmento) => fragmento.bold).map((fragmento) => fragmento.text);

    expect(fragmentosNegrita).toEqual([
      'CUARTA',
      'Curso de Prueba',
      'USD 20,00',
      '60 horas',
      'CLÁUSULA TERCERA'
    ]);
    expect(contenido.map((fragmento) => fragmento.text).join('')).toBe(texto);
  });

  it('bolds the defined course in all clauses without bolding unrelated text', () => {
    const texto = 'NOVENA.- Curso de Prueba y el resto del texto.';
    const contenido = component['formatearTextoContrato'](texto, 'Curso de Prueba', 8);

    expect(contenido.filter((fragmento) => fragmento.bold).map((fragmento) => fragmento.text))
      .toEqual(['NOVENA', 'Curso de Prueba']);
    expect(contenido.map((fragmento) => fragmento.text).join('')).toBe(texto);
  });

  it('adds the director and professional signatures in left-to-right order', () => {
    const firmas = component['crearBloqueFirmas'](
      {
        nombre: 'Dra. Ana Directora',
        cargo: 'Directora de Educación Continua a Distancia y Virtual',
        cedula: '1800000001'
      },
      {
        nombre: 'Mgs. Luis Profesional',
        cargo: 'PROFESIONAL',
        cedula: '1800000002'
      }
    );
    const celdas = firmas.stack[0].table.body[0];
    const sensibilidad = firmas.stack[1].text;

    expect(firmas.stack[0].layout).toBe('noBorders');
    expect(celdas[0].stack.map((fragmento: any) => fragmento.text).join(' '))
      .toContain('Dra. Ana Directora Directora de Educación Continua a Distancia y Virtual C.I. 1800000001');
    expect(celdas[1].stack.map((fragmento: any) => fragmento.text).join(' '))
      .toContain('Mgs. Luis Profesional PROFESIONAL C.I. 1800000002');
    expect(celdas[0].stack[0].margin).toEqual([0, 65, 0, 0]);
    expect(celdas[1].stack[0].margin).toEqual([0, 65, 0, 0]);
    expect(celdas.flatMap((celda: any) => celda.stack).some((fragmento: any) => fragmento.bold)).toBeFalse();
    expect(celdas.flatMap((celda: any) => celda.stack).some((fragmento: any) => fragmento.text.includes('___'))).toBeFalse();
    expect(sensibilidad.map((fragmento: any) => fragmento.text).join(''))
      .toBe('NIVEL DE SENSIBILIZACIÓN DE INFORMACIÓN: ALTO');
    expect(sensibilidad.filter((fragmento: any) => fragmento.bold).map((fragmento: any) => fragmento.text))
      .toEqual(['ALTO']);
  });
});
