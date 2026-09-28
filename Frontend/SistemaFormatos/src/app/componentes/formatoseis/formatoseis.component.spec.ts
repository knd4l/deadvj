import { FormatoseisComponent } from './formatoseis.component';
import Swal from 'sweetalert2';

describe('FormatoseisComponent', () => {
  let component: FormatoseisComponent;

  beforeEach(() => {
    component = new FormatoseisComponent(null as any, null as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sums every scheduled occurrence within a module period', () => {
    const formatComponent = new FormatoseisComponent(null as any, null as any);

    const total = formatComponent.obtenerTotalHorasModulo({
      desde: '2026-01-05',
      hasta: '2026-01-16',
      horario: [
        {
          tipo: 'Clases en vivo',
          dias: ['Lunes', 'Miércoles'],
          horaDesde: '08:00',
          horaHasta: '10:00'
        }
      ]
    });

    expect(total).toBe(8);
  });

  it('sums synchronous and asynchronous schedules saved one after another', () => {
    spyOn(Swal, 'fire');

    const modulo = {
      id: 2,
      nombre: 'Módulo 2',
      desde: '2026-01-05',
      hasta: '2026-01-16',
      contenidos: [],
      horario: [
        {
          tipo: 'Clases en vivo (sincrónico)',
          dias: ['Lunes', 'Miércoles'],
          horaDesde: '08:00',
          horaHasta: '10:00'
        },
        {
          tipo: 'Trabajo autónomo (asincrónico)',
          dias: ['Martes', 'Jueves'],
          horaDesde: '10:00',
          horaHasta: '12:00'
        }
      ]
    };

    component.guardarModulo(modulo, modulo.horario[0]);
    component.guardarModulo(modulo, modulo.horario[0]);

    expect(component.modulosGuardados[0].horario.length).toBe(2);
    expect(component.modulosGuardados[0].horario[0].tipo)
      .toBe('Clases en vivo (sincrónico)');
    expect(component.modulosGuardados[0].horario[1].tipo)
      .toBe('Trabajo autónomo (asincrónico)');
    expect(component.formato6.cargaHoraria).toBe('16');
  });

  it('keeps manually entered totals for additional budget items', () => {
    component.formato6.cargaHoraria = '10';
    component.presupuesto = [
      {
        partida: 1,
        numeroInstructores: 2,
        valor: 5,
        total: 50,
        descripcion: ''
      },
      {
        partida: '2',
        valor: 20,
        total: 35,
        descripcion: 'Materiales'
      }
    ];

    component.calcularTotalPresupuesto(1);

    expect(component.presupuesto[1].total).toBe(35);
    expect(component.calcularTotalGeneral()).toBe(85);
  });

  it('adds the instructor and hour description to the first budget item', () => {
    component.formato6.cargaHoraria = '16';
    component.presupuesto[0].numeroInstructores = 2;
    component.presupuesto.push({
      partida: '2',
      descripcion: 'Materiales',
      valor: 10,
      total: 10
    });

    const presupuesto = component.obtenerPresupuestoParaGuardar();

    expect(presupuesto[0].descripcion)
      .toBe('2 instructores × 16 horas');
    expect(presupuesto[1].descripcion).toBe('Materiales');
  });

  it('preserves text entered in Valor for added budget items', () => {
    component.presupuesto.push(
      {
        partida: '2',
        descripcion: '',
        valor: 'Refrigerios',
        total: 45
      },
      {
        partida: '3',
        descripcion: '',
        valor: '25.50',
        total: 25.5
      }
    );

    const presupuesto = component.obtenerPresupuestoParaGuardar();

    expect(presupuesto[1].valor).toBe('Refrigerios');
    expect(presupuesto[1].descripcion).toBe('');
    expect(presupuesto[2].descripcion).toBe('');
  });
});
