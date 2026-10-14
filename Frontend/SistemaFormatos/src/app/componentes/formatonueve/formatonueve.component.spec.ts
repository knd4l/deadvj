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
});
