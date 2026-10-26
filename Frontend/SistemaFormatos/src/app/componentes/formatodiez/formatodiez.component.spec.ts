import { FormatodiezComponent } from './formatodiez.component';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('FormatodiezComponent', () => {
  let component: FormatodiezComponent;

  beforeEach(() => {
    component = new FormatodiezComponent({
      obtenerFormato6: jasmine.createSpy('obtenerFormato6').and.returnValue(of({
        data: {
          success: true,
          item: [
            { formato6_codigo: 4, formato1_curso_definido: 'Curso definido' },
            { formato6_codigo: 5, formato1_curso_definido: '' }
          ]
        }
      }))
    } as any);
  });

  it('loads courses with a defined course name', () => {
    component.ngOnInit();

    expect(component.mostrarModal).toBeTrue();
    expect(component.cursosFormato6).toEqual([
      { formato6_codigo: 4, formato1_curso_definido: 'Curso definido' }
    ]);
    expect(component.cargandoCursos).toBeFalse();
  });

  it('opens the course selection modal and selects the chosen course', () => {
    component.ngOnInit();
    component.abrirModal();
    component.cursoSeleccionadoCodigo = 4;

    component.seleccionarCurso();

    expect(component.mostrarModal).toBeFalse();
    expect(component.cursoSeleccionado?.formato1_curso_definido).toBe('Curso definido');
  });

  it('requires a course to be selected before closing the modal', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    component.abrirModal();

    component.seleccionarCurso();

    expect(component.mostrarModal).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledWith(
      'Curso requerido',
      'Selecciona un curso definido para continuar.',
      'warning'
    );
  });
});
