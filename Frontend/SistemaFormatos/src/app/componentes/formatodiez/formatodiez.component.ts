import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';

interface CursoFormato6 {
  formato6_codigo: number;
  formato1_codigo_curso?: string | null;
  formato1_curso_definido?: string | null;
}

@Component({
  selector: 'app-formatodiez',
  templateUrl: './formatodiez.component.html',
  styleUrls: ['./formatodiez.component.css']
})
export class FormatodiezComponent implements OnInit {
  cursosFormato6: CursoFormato6[] = [];
  cursoSeleccionadoCodigo: number | null = null;
  cursoSeleccionado: CursoFormato6 | null = null;
  cargandoCursos = false;
  mostrarModal = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.mostrarModal = true;
    this.cargarCursos();
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  seleccionarCurso(): void {
    if (!this.cursoSeleccionadoCodigo) {
      Swal.fire('Curso requerido', 'Selecciona un curso definido para continuar.', 'warning');
      return;
    }

    this.cursoSeleccionado = this.cursosFormato6.find(
      (curso) => Number(curso.formato6_codigo) === Number(this.cursoSeleccionadoCodigo)
    ) || null;
    this.cerrarModal();
  }

  private cargarCursos(): void {
    this.cargandoCursos = true;
    this.modulosService.obtenerFormato6({ fx: 'getformato6', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargandoCursos = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.cursosFormato6 = [];
          Swal.fire(
            'Error',
            respuesta?.data?.message || 'No se pudieron cargar los cursos definidos.',
            'error'
          );
          return;
        }
        this.cursosFormato6 = respuesta.data.item.filter(
          (curso: CursoFormato6) => Boolean(curso.formato1_curso_definido?.trim())
        );
      },
      error: (error: any) => {
        this.cargandoCursos = false;
        this.cursosFormato6 = [];
        console.error('Error al cargar cursos definidos para el Formato 10:', error);
        Swal.fire('Error', 'No se pudieron cargar los cursos definidos.', 'error');
      }
    });
  }
}
