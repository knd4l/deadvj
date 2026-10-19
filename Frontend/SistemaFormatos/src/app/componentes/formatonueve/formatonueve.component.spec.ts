import { FormatonueveComponent } from './formatonueve.component';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('FormatonueveComponent', () => {
  let component: FormatonueveComponent;

  beforeEach(() => {
    component = new FormatonueveComponent(null as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allows adding and removing independent contract text areas', () => {
    const textosIniciales = component.textosContrato.map((texto) => ({ ...texto }));
    expect(textosIniciales.length).toBeGreaterThan(0);
    component.textosContrato[0].texto = 'Texto inicial';

    component.agregarTextoContrato();
    expect(component.textosContrato.length).toBe(textosIniciales.length + 1);
    expect(component.textosContrato[0].texto).toBe('Texto inicial');
    const textoAgregado = component.textosContrato[component.textosContrato.length - 1];
    expect(textoAgregado.texto).toBe('');

    component.eliminarTextoContrato(textoAgregado.id);
    expect(component.textosContrato.length).toBe(textosIniciales.length);
    expect(component.textosContrato.slice(1)).toEqual(textosIniciales.slice(1));
  });

  it('shows modules from the selected course and clears the selected module when changing course', () => {
    component.cursosFormato6 = [
      {
        formato6_codigo: 1,
        modulos: [{ id: 10, nombre: 'Módulo 1' }]
      },
      {
        formato6_codigo: 2,
        modulos: [{ id: 20, nombre: 'Módulo A' }, { id: 21, nombre: 'Módulo B' }]
      }
    ];
    component.formato6SeleccionadoCodigo = 1;
    component.formato6ModuloId = 10;

    expect(component.modulosDisponibles).toEqual([{ id: 10, nombre: 'Módulo 1' }]);

    component.formato6SeleccionadoCodigo = 2;
    component.seleccionarCurso();

    expect(component.formato6ModuloId).toBeNull();
    expect(component.modulosDisponibles).toEqual([
      { id: 20, nombre: 'Módulo A' },
      { id: 21, nombre: 'Módulo B' }
    ]);
  });

  it('saves the selected course, module, and all contract texts', () => {
    const insertarFormato9 = jasmine.createSpy('insertarFormato9')
      .and.returnValue(of({ data: { success: true, message: 'Guardado' } }));
    const servicio = { insertarFormato9 };
    const componente = new FormatonueveComponent(servicio as any);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    componente.formato6SeleccionadoCodigo = 12;
    componente.formato6ModuloId = 3;
    componente.textosContrato = [
      { id: 1, texto: 'Texto de prueba 1' },
      { id: 2, texto: 'Texto de prueba 2' }
    ];

    componente.guardarFormato9();

    expect(insertarFormato9).toHaveBeenCalledWith({
      fx: 'insertformato9',
      d: {
        formato6Codigo: 12,
        formato6ModuloId: 3,
        textos: ['Texto de prueba 1', 'Texto de prueba 2']
      }
    });
    expect(componente.guardando).toBeFalse();
  });

  it('inserts the director title, name, and surname after the opening phrase in text 1', () => {
    const obtenerDirectores = jasmine.createSpy('obtenerDirectores')
      .and.returnValue(of({
        data: {
          success: true,
          item: [{ tit_dir: 'Dra.', nom_dir: 'Ana María', ape_dir: 'Pérez López' }]
        }
      }));
    const componente = new FormatonueveComponent({ obtenerDirectores } as any);

    componente.cargarDirector();

    expect(obtenerDirectores).toHaveBeenCalledWith({ fx: 'getdirectores', d: {} });
    expect(componente.textosContrato[0].texto).toContain(
      'comparecen por una parte la Dra. Ana María Pérez López, en calidad de Directora de Educación Continua'
    );
  });

  it('inserts the selected defined course in the approval phrase of text 2', () => {
    component.cursosFormato6 = [{
      formato6_codigo: 12,
      formato1_curso_definido: 'Curso de Prueba',
      modulos: [{ id: 3, nombre: 'Módulo 1' }]
    }];
    component.formato6SeleccionadoCodigo = 12;

    component.seleccionarCurso();

    expect(component.textosContrato[1].texto).toContain(
      'se aprueba el Curso “Curso de Prueba"; y Resolución'
    );
    expect(component.textosContrato[1].texto).toContain(
      'en calidad de Instructor del Curso: “Curso de Prueba” Módulo **, del'
    );
  });

  it('inserts the selected module name in the instructor course phrase of text 2', () => {
    const obtenerFormato6Reporte = jasmine.createSpy('obtenerFormato6Reporte')
      .and.returnValue(of({ data: { item: [{ cronograma: [] }] } }));
    const componente = new FormatonueveComponent({ obtenerFormato6Reporte } as any);
    componente.cursosFormato6 = [{
      formato6_codigo: 12,
      formato1_curso_definido: 'Curso de Prueba',
      modulos: [{ id: 3, nombre: 'Módulo de Prueba' }]
    }];
    componente.formato6SeleccionadoCodigo = 12;
    componente.formato6ModuloId = 3;

    componente.seleccionarModulo();

    expect(componente.textosContrato[1].texto).toContain(
      'en calidad de Instructor del Curso: “Curso de Prueba” Módulo Módulo de Prueba, del'
    );
  });

  it('inserts the module execution dates, total hours, and first budget value in text 2', () => {
    const obtenerFormato6Reporte = jasmine.createSpy('obtenerFormato6Reporte')
      .and.returnValue(of({
        data: {
          item: [{
            cronograma: [
              {
                modulo: 'Módulo de Prueba',
                desde: '2026-10-01',
                hasta: '2026-10-15',
                actividad: 'Clases',
                dias: 'lunes',
                horario: '08:00 - 10:00',
                horas_totales: 24
              },
              {
                modulo: 'Módulo de Prueba',
                desde: '2026-10-01',
                hasta: '2026-10-15',
                actividad: 'Taller',
                dias: 'martes',
                horario: '10:00 - 13:00',
                horas_totales: 36
              },
              {
                modulo: 'Otro módulo',
                desde: '2026-10-01',
                hasta: '2026-10-30',
                actividad: 'Clases',
                dias: 'miércoles',
                horario: '08:00 - 12:00',
                horas_totales: 20
              }
            ],
            presupuesto: [{ valor: '125.50' }, { valor: '999.00' }]
          }]
        }
      }));
    const componente = new FormatonueveComponent({ obtenerFormato6Reporte } as any);
    componente.cursosFormato6 = [{
      formato6_codigo: 12,
      formato1_curso_definido: 'Curso de Prueba',
      modulos: [{ id: 3, nombre: 'Módulo de Prueba' }]
    }];
    componente.formato6SeleccionadoCodigo = 12;
    componente.formato6ModuloId = 3;

    componente.seleccionarModulo();

    expect(componente.textosContrato[1].texto).toContain(
      'Módulo de Prueba, del 1 de octubre de 2026 al 15 de octubre de 2026 con una duración de 60 horas'
    );
    expect(componente.textosContrato[1].texto).toContain(
      'autorizar el pago de USD 125.50 la hora clase respectivamente;'
    );
    expect(componente.textosContrato[4].texto).toContain(
      'a razón de USD 125.50 la hora clase, por las 60 horas dictadas en el referido curso'
    );
  });

  it('inserts the authority, defined course, and scheduled execution dates in text 3', () => {
    const obtenerAutoridades = jasmine.createSpy('obtenerAutoridades')
      .and.returnValue(of({
        data: {
          success: true,
          item: [{ titulo: 'Dra.', nom_aut: 'María', ape_aut: 'Pérez' }]
        }
      }));
    const obtenerFormato6Reporte = jasmine.createSpy('obtenerFormato6Reporte')
      .and.returnValue(of({
        data: {
          item: [{
            formato1_modalidad_nombre: 'Virtual',
            cronograma: [{
              modulo: 'Módulo de Prueba',
              desde: '2026-10-14',
              hasta: '2026-10-31',
              actividad: 'Clases',
              dias: 'miércoles, jueves, viernes, sábado',
              horario: '08:00 - 10:00',
              horas_totales: 20
            }],
            presupuesto: []
          }]
        }
      }));
    const componente = new FormatonueveComponent({
      obtenerAutoridades,
      obtenerFormato6Reporte
    } as any);
    componente.cursosFormato6 = [{
      formato6_codigo: 12,
      formato1_curso_definido: 'Curso de Prueba',
      modulos: [{ id: 3, nombre: 'Módulo de Prueba' }]
    }];
    componente.formato6SeleccionadoCodigo = 12;
    componente.formato6ModuloId = 3;

    componente.cargarAutoridad();
    componente.seleccionarModulo();

    expect(componente.textosContrato[2].texto).toContain(
      'prestará el Dra. María Pérez, en calidad de Instructor'
    );
    expect(componente.textosContrato[4].texto).toContain(
      'pagará al profesional Dra. María Pérez, por concepto de honorarios'
    );
    expect(componente.textosContrato[2].texto).toContain(
      'en calidad de Instructor del Curso: “Curso de Prueba”'
    );
    expect(componente.textosContrato[2].texto).toContain(
      'en modalidad Virtual, las clases en modalidad virtual'
    );
    expect(componente.textosContrato[2].texto).toContain(
      'los días 14, 15, 16, 17, 21, 22, 23, 24, 28, 29, 30, 31 de octubre de 2026, evento organizado'
    );
    expect(componente.textosContrato[3].texto).toContain(
      'regirá a las partes días 14, 15, 16, 17, 21, 22, 23, 24, 28, 29, 30, 31 de octubre de 2026.'
    );
    expect(componente.datosNovena?.diasEjecucion).toBe(
      '14, 15, 16, 17, 21, 22, 23, 24, 28, 29, 30, 31 de octubre de 2026'
    );
  });

  it('inserts the authority title, name, and surname after the hiring phrase in text 2', () => {
    const obtenerAutoridades = jasmine.createSpy('obtenerAutoridades')
      .and.returnValue(of({
        data: {
          success: true,
          item: [{ titulo: 'Dr.', nom_aut: 'Juan Carlos', ape_aut: 'López Ruiz' }]
        }
      }));
    const componente = new FormatonueveComponent({ obtenerAutoridades } as any);

    componente.cargarAutoridad();

    expect(obtenerAutoridades).toHaveBeenCalledWith({ fx: 'getautoridades', d: {} });
    expect(componente.textosContrato[1].texto).toContain(
      'la Contratación del Dr. Juan Carlos López Ruiz  en calidad'
    );
  });
});
