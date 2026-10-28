import { FormatodiezComponent } from './formatodiez.component';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('FormatodiezComponent', () => {
  let component: FormatodiezComponent;
  let modulosService: any;

  beforeEach(() => {
    modulosService = {
      obtenerFormato6: jasmine.createSpy('obtenerFormato6').and.returnValue(of({
        data: {
          success: true,
          item: [
            {
              formato6_codigo: 4,
              formato1_codigo_curso: 'CUR-04',
              formato1_curso_definido: 'Curso definido'
            },
            { formato6_codigo: 5, formato1_codigo_curso: 'CUR-05', formato1_curso_definido: '' }
          ]
        }
      })),
      obtenerUsuariosFormato5: jasmine.createSpy('obtenerUsuariosFormato5').and.returnValue(of({
        data: { success: true, item: [{ cedula: '123', nombres: 'Ana', apellidos: 'Pérez' }] }
      })),
      obtenerLicenciasFormato10: jasmine.createSpy('obtenerLicenciasFormato10').and.returnValue(of({
        data: { success: true, item: [{ id: 1, nombre: 'CANVA' }] }
      })),
      obtenerFormatos10: jasmine.createSpy('obtenerFormatos10').and.returnValue(of({
        data: { success: true, item: [] }
      })),
      insertarFormato10: jasmine.createSpy('insertarFormato10').and.returnValue(of({
        data: { success: true }
      })),
      actualizarFormato10: jasmine.createSpy('actualizarFormato10').and.returnValue(of({
        data: { success: true }
      }))
    };
    component = new FormatodiezComponent(modulosService);
  });

  it('loads all defined courses without opening the create dialog or loading instructor data', () => {
    component.ngOnInit();

    expect(component.mostrarModal).toBeFalse();
    expect(component.cursosFormato6).toEqual([
      {
        formato6_codigo: 4,
        formato1_codigo_curso: 'CUR-04',
        formato1_curso_definido: 'Curso definido'
      }
    ]);
    expect(component.cursosTabla.length).toBe(1);
    expect(component.cursosTabla[0].formato).toBeNull();
    expect(modulosService.obtenerUsuariosFormato5).not.toHaveBeenCalled();
    expect(modulosService.obtenerLicenciasFormato10).not.toHaveBeenCalled();
    expect(component.cargandoCursos).toBeFalse();
  });

  it('loads instructor data when creating from a course and refreshes the table after saving', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    modulosService.obtenerFormatos10.and.returnValues(
      of({ data: { success: true, item: [] } }),
      of({
        data: {
          success: true,
          item: [{
            formato10_codigo: 12,
            formato6_codigo: 4,
            formato10_instructor_nombres: 'Ana',
            formato10_instructor_apellidos: 'Pérez'
          }]
        }
      })
    );
    component.ngOnInit();
    component.abrirModal(component.cursosFormato6[0]);

    expect(component.mostrarModal).toBeTrue();
    expect(component.cursoSeleccionadoCodigo).toBe(4);
    expect(modulosService.obtenerUsuariosFormato5).toHaveBeenCalled();
    expect(modulosService.obtenerLicenciasFormato10).toHaveBeenCalled();

    component.instructorSeleccionadoCedula = '123';
    component.guardarFormato();

    expect(component.mostrarModal).toBeFalse();
    expect(modulosService.obtenerFormatos10).toHaveBeenCalledTimes(2);
    expect(component.cursosTabla[0].formato?.formato10_instructor_nombres).toBe('Ana');
    expect(modulosService.insertarFormato10).toHaveBeenCalledWith({
      fx: 'insertformato10',
      d: { formato6Codigo: 4, instructorCedula: '123', licencias: [] }
    });
  });

  it('requires a course to be selected before closing the modal', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    component.ngOnInit();
    component.abrirModal(component.cursosFormato6[0]);
    component.cursoSeleccionadoCodigo = null;

    component.guardarFormato();

    expect(component.mostrarModal).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledWith(
      'Curso requerido',
      'Selecciona un curso definido para continuar.',
      'warning'
    );
  });

  it('preloads an existing instructor and licenses and updates the existing format', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    const formato = {
      formato10_codigo: 12,
      formato6_codigo: 4,
      formato10_instructor_cedula: '123',
      licencias: [{ id: 1, nombre: 'CANVA', seleccionada: 1 }]
    } as any;
    component.ngOnInit();
    component.abrirModal(component.cursosFormato6[0], formato);

    expect(component.formato10CodigoEditando).toBe(12);
    expect(component.instructorSeleccionadoCedula).toBe('123');
    expect(component.licencias[0].seleccionada).toBeTrue();

    component.guardarFormato();

    expect(modulosService.actualizarFormato10).toHaveBeenCalledWith({
      fx: 'updateformato10',
      d: {
        formato10Codigo: 12,
        formato6Codigo: 4,
        instructorCedula: '123',
        licencias: [1]
      }
    });
    expect(modulosService.insertarFormato10).not.toHaveBeenCalled();
  });
});
