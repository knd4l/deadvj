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
            { formato6_codigo: 4, formato1_curso_definido: 'Curso definido' },
            { formato6_codigo: 5, formato1_curso_definido: '' }
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
      }))
    };
    component = new FormatodiezComponent(modulosService);
  });

  it('loads courses with a defined course name', () => {
    component.ngOnInit();

    expect(component.mostrarModal).toBeTrue();
    expect(component.cursosFormato6).toEqual([
      { formato6_codigo: 4, formato1_curso_definido: 'Curso definido' }
    ]);
    expect(component.cargandoCursos).toBeFalse();
  });

  it('saves the selected course and instructor and closes the modal', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    component.ngOnInit();
    component.abrirModal();
    component.cursoSeleccionadoCodigo = 4;
    component.instructorSeleccionadoCedula = '123';

    component.guardarFormato();

    expect(component.mostrarModal).toBeFalse();
    expect(modulosService.insertarFormato10).toHaveBeenCalledWith({
      fx: 'insertformato10',
      d: { formato6Codigo: 4, instructorCedula: '123', licencias: [] }
    });
  });

  it('requires a course to be selected before closing the modal', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    component.abrirModal();

    component.guardarFormato();

    expect(component.mostrarModal).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledWith(
      'Curso requerido',
      'Selecciona un curso definido para continuar.',
      'warning'
    );
  });
});
