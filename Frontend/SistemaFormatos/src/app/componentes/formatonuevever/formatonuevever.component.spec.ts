import { FormatonueveverComponent } from './formatonuevever.component';

describe('FormatonueveverComponent', () => {
  let component: FormatonueveverComponent;

  beforeEach(() => {
    localStorage.removeItem('formatonuevever_codigo_reporte');
    localStorage.removeItem('formatonuevever_codigo_reporte_formato_31');
    component = new FormatonueveverComponent(null as any);
  });

  it('uses the same assigned report code every time an existing format is opened', () => {
    const formato = { formato9_codigo: 31 } as any;
    localStorage.setItem('formatonuevever_codigo_reporte_formato_31', 'UTA-DEADV-C-2025-014');
    localStorage.setItem('formatonuevever_codigo_reporte', 'UTA-DEADV-C-2025-020');

    expect(component['obtenerCodigoReporte'](formato)).toBe('UTA-DEADV-C-2025-014');
    expect(component['obtenerCodigoReporte'](formato)).toBe('UTA-DEADV-C-2025-014');
    expect(localStorage.getItem('formatonuevever_codigo_reporte')).toBe('UTA-DEADV-C-2025-020');
  });

  it('assigns a stable code to a previously unassigned format without advancing the counter', () => {
    component.codigoReporte = 'UTA-DEADV-C-2025-020';
    const formato = { formato9_codigo: 31 } as any;

    expect(component['obtenerCodigoReporte'](formato)).toBe('UTA-DEADV-C-2025-031');
    expect(component['obtenerCodigoReporte'](formato)).toBe('UTA-DEADV-C-2025-031');
    expect(localStorage.getItem('formatonuevever_codigo_reporte')).toBeNull();
  });

  it('keeps each work date and its hours together on one line', () => {
    const contenido = component['crearContenidoDiasTrabajo']([
      { texto: 'miércoles 24 septiembre', horas: 4, sincronico: true },
      { texto: 'jueves 25 septiembre', horas: 2.5, sincronico: false }
    ]);

    expect(contenido).toEqual([
      { text: 'miércoles 24 septiembre (4h)', bold: true, noWrap: true },
      { text: '\n' },
      { text: 'jueves 25 septiembre (2,5h)', bold: false, noWrap: true }
    ]);
  });

  it('keeps only the most recently created report for each module and course', () => {
    const formatoAnterior = {
      formato9_codigo: 1,
      formato6_codigo: 10,
      formato9_modulo_id: 2,
      formato9_fecha_creacion: '2026-01-10 09:00:00'
    } as any;
    const formatoReciente = {
      ...formatoAnterior,
      formato9_codigo: 2,
      formato9_fecha_creacion: '2026-01-11 09:00:00'
    };
    const otroCurso = {
      ...formatoAnterior,
      formato9_codigo: 3,
      formato6_codigo: 11
    };

    const resultado = component['obtenerFormatosMasRecientes']([
      formatoAnterior,
      formatoReciente,
      otroCurso
    ]);

    expect(resultado).toEqual([formatoReciente, otroCurso]);
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
