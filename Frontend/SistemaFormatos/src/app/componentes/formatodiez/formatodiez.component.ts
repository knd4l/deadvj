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
  formato10_area: string;
  formato10_modalidad: string;
  formato10_tematica: string;
  formato10_periodo_uso: string;
  formato10_instructor_cedula: string;
  formato10_instructor_nombres: string;
  formato10_instructor_apellidos: string;
  formato10_instructor_correo: string;
  formato10_instructor_telefono: string;
  formato10_detalle_uso: string;
  formato10_fecha_creacion: string;
  licencias: Array<{ id: number; nombre: string; seleccionada: boolean | number }>;
}

interface CursoFormato10 extends CursoFormato6 {
  formato: Formato10 | null;
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
  formato10CodigoEditando: number | null = null;
  cursoSeleccionadoNombre: string | null = null;
  instructorSeleccionadoCedula: string | null = null;
  private licenciasSeleccionadasIniciales: number[] = [];
  detalleUso = 'La contraseña entregada vía correo electrónico al Instructor será actualizada periódicamente y de forma obligatoria después de que los períodos de uso concluyan';
  cargandoCursos = false;
  cargandoUsuarios = false;
  cargandoLicencias = false;
  licenciasCargadas = false;
  cargandoFormatos = false;
  formatosCargados = false;
  guardando = false;
  mostrarModal = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarFormatos();
  }

  get cursosTabla(): CursoFormato10[] {
    return this.cursosFormato6.map((curso) => ({
      ...curso,
      formato: this.formatos.find((formato) => formato.formato6_codigo === curso.formato6_codigo) || null
    }));
  }

  abrirModal(curso: CursoFormato6, formato: Formato10 | null = null): void {
    if (!this.formatosCargados || this.guardando) {
      return;
    }

    this.cursoSeleccionadoCodigo = curso.formato6_codigo;
    this.formato10CodigoEditando = formato?.formato10_codigo || null;
    this.cursoSeleccionadoNombre = curso.formato1_curso_definido || null;
    this.instructorSeleccionadoCedula = formato?.formato10_instructor_cedula || null;
    this.licenciasSeleccionadasIniciales = formato
      ? formato.licencias.filter((licencia) => Number(licencia.seleccionada) === 1).map((licencia) => licencia.id)
      : [];
    this.licencias.forEach((licencia) => licencia.seleccionada = false);
    this.mostrarModal = true;
    this.cargarUsuarios();
    this.cargarLicencias();
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

    const editando = this.formato10CodigoEditando !== null;
    const payload = {
      formato10Codigo: this.formato10CodigoEditando,
      formato6Codigo: this.cursoSeleccionadoCodigo,
      instructorCedula: this.instructorSeleccionadoCedula,
      licencias: this.licencias.filter((licencia) => licencia.seleccionada).map((licencia) => licencia.id)
    };
    this.guardando = true;
    const solicitud = editando
      ? this.modulosService.actualizarFormato10({ fx: 'updateformato10', d: payload })
      : this.modulosService.insertarFormato10({
        fx: 'insertformato10',
        d: {
          formato6Codigo: payload.formato6Codigo,
          instructorCedula: payload.instructorCedula,
          licencias: payload.licencias
        }
      });
    solicitud.subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (!respuesta?.data?.success) {
          Swal.fire('Error', respuesta?.data?.message || 'No se pudo guardar el Formato 10.', 'error');
          return;
        }

        this.cerrarModal();
        this.cursoSeleccionadoCodigo = null;
        this.formato10CodigoEditando = null;
        this.cursoSeleccionadoNombre = null;
        this.instructorSeleccionadoCedula = null;
        this.licencias.forEach((licencia) => licencia.seleccionada = false);
        this.cargarFormatos();
        Swal.fire(
          editando ? 'Actualizado' : 'Guardado',
          `El Formato 10 se ${editando ? 'actualizó' : 'guardó'} correctamente.`,
          'success'
        );
      },
      error: (error: any) => {
        this.guardando = false;
        console.error('Error al guardar el Formato 10:', error);
        Swal.fire('Error', 'No se pudo guardar el Formato 10.', 'error');
      }
    });
  }

  async verPdf(formato: Formato10): Promise<void> {
    try {
      const [encabezado, pie] = await Promise.all([
        this.convertirImagenBase64('assets/img/encabezado.jpg'),
        this.convertirImagenBase64('assets/img/footer.jpeg')
      ]);
      const fuentes = pdfFonts as any;
      (pdfMake as any).vfs = fuentes.pdfMake?.vfs || fuentes.vfs;
      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 85, 40, 78],
        header: { image: encabezado, width: 515, alignment: 'center', margin: [0, 12, 0, 0] },
        footer: { image: pie, width: 515, alignment: 'center', margin: [0, 0, 0, 12] },
        content: [
          { text: ' ', style: 'titulo', alignment: 'center', margin: [0, 0, 0, 24] },
          {
            table: {
              widths: ['20%', '30%', '20%', '30%'],
              body: [
                [
                  { text: 'Número del formulario', bold: true },
                  { text: String(formato.formato10_codigo), colSpan: 3 },
                  {},
                  {}
                ],
                [
                  { text: 'Fecha de solicitud', bold: true },
                  this.formatearFechaSolicitud(formato.formato10_fecha_creacion),
                  { text: 'Código del curso', bold: true },
                  formato.formato10_curso_codigo || 'Sin código'
                ],
                [
                  { text: 'Apellidos y nombres', bold: true },
                  `${formato.formato10_instructor_apellidos} ${formato.formato10_instructor_nombres}`,
                  { text: 'Correo electrónico', bold: true },
                  formato.formato10_instructor_correo || 'No registrado'
                ],
                [
                  { text: 'Documento de identidad', bold: true },
                  formato.formato10_instructor_cedula,
                  { text: 'Teléfono', bold: true },
                  formato.formato10_instructor_telefono || 'No registrado'
                ],
                [
                  { text: 'Área', bold: true, alignment: 'center' },
                  { text: 'Modalidad', bold: true, alignment: 'center' },
                  { text: 'Temática', bold: true, alignment: 'center' },
                  { text: 'Período de uso', bold: true, alignment: 'center' }
                ],
                [
                  { text: formato.formato10_area || '—', alignment: 'center' },
                  { text: formato.formato10_modalidad || '—', alignment: 'center' },
                  { text: formato.formato10_tematica || '—', alignment: 'center' },
                  { text: formato.formato10_periodo_uso || '—', alignment: 'center' }
                ],
                [
                  { text: 'Licencias', bold: true },
                  { ...this.crearContenidoLicencias(formato.licencias), colSpan: 3 },
                  {},
                  {}
                ],
                [
                  { text: 'Detalle de uso', bold: true },
                  { text: formato.formato10_detalle_uso, colSpan: 3 },
                  {},
                  {}
                ]
              ]
            },
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

  private crearContenidoLicencias(licencias: Formato10['licencias']): any {
    if (licencias.length === 0) {
      return { text: 'No hay licencias activas' };
    }

    return {
      columns: licencias.map((licencia) => {
        const canvas: any[] = [{
          type: 'rect',
          x: 0,
          y: 1,
          w: 10,
          h: 10,
          lineWidth: 1
        }];
        if (Number(licencia.seleccionada) === 1) {
          canvas.push(
            { type: 'line', x1: 2, y1: 3, x2: 8, y2: 9, lineWidth: 1 },
            { type: 'line', x1: 8, y1: 3, x2: 2, y2: 9, lineWidth: 1 }
          );
        }
        return {
          width: '*',
          columns: [
            { width: 12, canvas },
            { width: '*', text: licencia.nombre, fontSize: 9 }
          ],
          columnGap: 3
        };
      }),
      columnGap: 4
    };
  }

  private formatearFechaSolicitud(fecha: string): string {
    const fechaISO = fecha.split(' ')[0];
    const partes = fechaISO.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fecha;
  }

  private convertirImagenBase64(ruta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const imagen = new Image();
      imagen.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imagen.naturalWidth;
        canvas.height = imagen.naturalHeight;
        const contexto = canvas.getContext('2d');
        if (!contexto) {
          reject(new Error('No se pudo preparar la imagen del reporte.'));
          return;
        }
        contexto.drawImage(imagen, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      imagen.onerror = () => reject(new Error(`No se pudo cargar ${ruta}`));
      imagen.src = ruta;
    });
  }

  private cargarFormatos(): void {
    this.cargandoFormatos = true;
    this.formatosCargados = false;
    this.modulosService.obtenerFormatos10({ fx: 'getformato10', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargandoFormatos = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.formatos = [];
          Swal.fire('Error', respuesta?.data?.message || 'No se pudieron cargar los Formatos 10.', 'error');
          return;
        }
        this.formatos = respuesta.data.item;
        this.formatosCargados = true;
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
    this.licenciasCargadas = false;
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
          seleccionada: this.licenciasSeleccionadasIniciales.includes(licencia.id)
        }));
        this.licenciasCargadas = true;
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
