import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

interface CursoFormato6 {
  formato6_codigo: number;
  formato1_codigo_curso?: string | null;
  formato1_curso_definido?: string | null;
}

interface UsuarioInstructor {
  cedula: string;
  nombres: string;
  apellidos: string;
}

interface LicenciaFormato10 {
  id: number;
  nombre: string;
  seleccionada: boolean;
}

interface Formato10 {
  formato10_codigo: number;
  formato6_codigo: number;
  formato10_curso_codigo: string | null;
  formato10_curso_nombre: string;
  formato10_instructor_cedula: string;
  formato10_instructor_nombres: string;
  formato10_instructor_apellidos: string;
  formato10_detalle_uso: string;
  formato10_fecha_creacion: string;
  licencias: Array<{ id: number; nombre: string }>;
}

@Component({
  selector: 'app-formatodiez',
  templateUrl: './formatodiez.component.html',
  styleUrls: ['./formatodiez.component.css']
})
export class FormatodiezComponent implements OnInit {
  cursosFormato6: CursoFormato6[] = [];
  usuarios: UsuarioInstructor[] = [];
  licencias: LicenciaFormato10[] = [];
  formatos: Formato10[] = [];
  cursoSeleccionadoCodigo: number | null = null;
  instructorSeleccionadoCedula: string | null = null;
  detalleUso = 'La contraseña entregada vía correo electrónico al Instructor será actualizada periódicamente y de forma obligatoria después de que los períodos de uso concluyan';
  cargandoCursos = false;
  cargandoUsuarios = false;
  cargandoLicencias = false;
  cargandoFormatos = false;
  guardando = false;
  mostrarModal = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.mostrarModal = true;
    this.cargarCursos();
    this.cargarUsuarios();
    this.cargarLicencias();
    this.cargarFormatos();
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarFormato(): void {
    if (this.guardando) {
      return;
    }

    if (!this.cursoSeleccionadoCodigo) {
      Swal.fire('Curso requerido', 'Selecciona un curso definido para continuar.', 'warning');
      return;
    }

    if (!this.instructorSeleccionadoCedula) {
      Swal.fire('Instructor requerido', 'Selecciona un instructor para continuar.', 'warning');
      return;
    }

    this.guardando = true;
    this.modulosService.insertarFormato10({
      fx: 'insertformato10',
      d: {
        formato6Codigo: this.cursoSeleccionadoCodigo,
        instructorCedula: this.instructorSeleccionadoCedula,
        licencias: this.licencias.filter((licencia) => licencia.seleccionada).map((licencia) => licencia.id)
      }
    }).subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (!respuesta?.data?.success) {
          Swal.fire('Error', respuesta?.data?.message || 'No se pudo guardar el Formato 10.', 'error');
          return;
        }

        this.cerrarModal();
        this.cursoSeleccionadoCodigo = null;
        this.instructorSeleccionadoCedula = null;
        this.licencias.forEach((licencia) => licencia.seleccionada = false);
        this.cargarFormatos();
        Swal.fire('Guardado', 'El Formato 10 se guardó correctamente.', 'success');
      },
      error: (error: any) => {
        this.guardando = false;
        console.error('Error al guardar el Formato 10:', error);
        Swal.fire('Error', 'No se pudo guardar el Formato 10.', 'error');
      }
    });
  }

  verPdf(formato: Formato10): void {
    try {
      const fuentes = pdfFonts as any;
      (pdfMake as any).vfs = fuentes.pdfMake?.vfs || fuentes.vfs;
      const documento = {
        pageSize: 'A4',
        pageMargins: [48, 48, 48, 48],
        content: [
          { text: 'FORMATO 10', style: 'titulo', alignment: 'center', margin: [0, 0, 0, 24] },
          {
            table: {
              widths: ['35%', '65%'],
              body: [
                [{ text: 'Código del curso', bold: true }, formato.formato10_curso_codigo || 'Sin código'],
                [{ text: 'Nombre del curso', bold: true }, formato.formato10_curso_nombre],
                [{ text: 'Instructor', bold: true }, `${formato.formato10_instructor_nombres} ${formato.formato10_instructor_apellidos}`],
                [{ text: 'Cédula', bold: true }, formato.formato10_instructor_cedula],
                [{ text: 'Licencias', bold: true }, formato.licencias.map((licencia) => licencia.nombre).join(', ') || 'Ninguna'],
                [{ text: 'Detalle de uso', bold: true }, formato.formato10_detalle_uso]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ],
        styles: {
          titulo: { fontSize: 16, bold: true }
        },
        defaultStyle: { fontSize: 11 }
      };

      (pdfMake as any).createPdf(documento).open();
    } catch (error) {
      console.error('No se pudo generar el PDF del Formato 10:', error);
      Swal.fire('Error', 'No se pudo abrir el PDF del Formato 10.', 'error');
    }
  }

  private cargarFormatos(): void {
    this.cargandoFormatos = true;
    this.modulosService.obtenerFormatos10({ fx: 'getformato10', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargandoFormatos = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.formatos = [];
          Swal.fire('Error', respuesta?.data?.message || 'No se pudieron cargar los Formatos 10.', 'error');
          return;
        }
        this.formatos = respuesta.data.item;
      },
      error: (error: any) => {
        this.cargandoFormatos = false;
        this.formatos = [];
        console.error('Error al cargar los Formatos 10:', error);
        Swal.fire('Error', 'No se pudieron cargar los Formatos 10.', 'error');
      }
    });
  }

  private cargarLicencias(): void {
    this.cargandoLicencias = true;
    this.modulosService.obtenerLicenciasFormato10({ fx: 'getlicenciasformato10', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargandoLicencias = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.licencias = [];
          Swal.fire(
            'Error',
            respuesta?.data?.message || 'No se pudieron cargar las licencias.',
            'error'
          );
          return;
        }

        this.licencias = respuesta.data.item.map((licencia: { id: number; nombre: string }) => ({
          ...licencia,
          seleccionada: false
        }));
      },
      error: (error: any) => {
        this.cargandoLicencias = false;
        this.licencias = [];
        console.error('Error al cargar licencias para el Formato 10:', error);
        Swal.fire('Error', 'No se pudieron cargar las licencias.', 'error');
      }
    });
  }

  private cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.modulosService.obtenerUsuariosFormato5({ fx: 'getusuariosformato5', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargandoUsuarios = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.usuarios = [];
          Swal.fire(
            'Error',
            respuesta?.data?.message || 'No se pudieron cargar los instructores.',
            'error'
          );
          return;
        }

        this.usuarios = respuesta.data.item;
      },
      error: (error: any) => {
        this.cargandoUsuarios = false;
        this.usuarios = [];
        console.error('Error al cargar instructores para el Formato 10:', error);
        Swal.fire('Error', 'No se pudieron cargar los instructores.', 'error');
      }
    });
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
