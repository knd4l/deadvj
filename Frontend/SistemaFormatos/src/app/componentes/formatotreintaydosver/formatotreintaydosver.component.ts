import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ModulosService } from '../../servicios/modulos.service';

interface NotificacionFormato32 {
  formato32_codigo: number;
  fecha_notificacion: string;
  tipo_notificacion: 'individual' | 'grupal';
  nombres_notificado: string | null;
  apellidos_notificado: string | null;
  medio_notificacion: string;
  detalle: string;
  fecha_creacion: string;
}

interface RegistroFormato32 extends NotificacionFormato32 {
  instructor_identificacion: string;
  instructor_nombres: string;
  instructor_apellidos: string;
  formato6_codigo: number;
  formato32_modulo_id: number | null;
  formato6_modulos: string | null;
  observaciones: string | null;
  formato1_codigo_curso: string | null;
  formato1_curso_definido: string | null;
  formato1_fecha_ejecucion_desde: string | null;
  formato1_fecha_ejecucion_hasta: string | null;
  formato6_modalidad: string | null;
  formato6_fecha_elaboracion: string | null;
}

interface Formato32Registro extends RegistroFormato32 {
  notificaciones: NotificacionFormato32[];
}

@Component({
  selector: 'app-formatotreintaydosver',
  templateUrl: './formatotreintaydosver.component.html',
  styleUrls: ['./formatotreintaydosver.component.css']
})
export class FormatotreintaydosverComponent implements OnInit {
  formatos: Formato32Registro[] = [];
  cargando = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarFormatos();
  }

  cargarFormatos(): void {
    this.cargando = true;
    this.modulosService.obtenerFormatos32({ fx: 'getformato32', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargando = false;
        if (respuesta?.data?.success && Array.isArray(respuesta.data.item)) {
          this.formatos = this.agruparNotificaciones(respuesta.data.item);
          return;
        }

        this.formatos = [];
        Swal.fire('Error', respuesta?.data?.message || 'No se pudieron cargar los registros del Formato 32.', 'error');
      },
      error: () => {
        this.cargando = false;
        this.formatos = [];
        Swal.fire('Error', 'No se pudieron cargar los registros del Formato 32.', 'error');
      }
    });
  }

  private agruparNotificaciones(registros: RegistroFormato32[]): Formato32Registro[] {
    const grupos = new Map<string, Formato32Registro>();
    registros.forEach((registro) => {
      const clave = [
        registro.instructor_identificacion,
        registro.formato6_codigo,
        registro.formato32_modulo_id,
        registro.fecha_creacion
      ].join(':');
      const grupo = grupos.get(clave);
      if (grupo) {
        grupo.notificaciones.push(registro);
        return;
      }

      grupos.set(clave, { ...registro, notificaciones: [registro] });
    });
    return Array.from(grupos.values());
  }

  resumenFechas(formato: Formato32Registro): string {
    return Array.from(new Set(formato.notificaciones.map((notificacion) =>
      this.formatearFecha(notificacion.fecha_notificacion)
    ))).join(', ');
  }

  resumenMedios(formato: Formato32Registro): string {
    const medios = new Set<string>();
    formato.notificaciones.forEach((notificacion) => {
      notificacion.medio_notificacion.split(',').forEach((medio) => {
        const limpio = medio.trim();
        if (limpio) {
          medios.add(limpio);
        }
      });
    });
    return Array.from(medios).join(', ');
  }

  async verPdf(formato: Formato32Registro): Promise<void> {
    try {
      const encabezado = await this.convertirImagenBase64('assets/img/encabezado.jpg');
      const pie = await this.convertirImagenBase64('assets/img/footer.jpeg');
      const fuentes = pdfFonts as any;
      (pdfMake as any).vfs = fuentes.pdfMake?.vfs || fuentes.vfs;

      const mostrar = (valor: string | number | null | undefined): string =>
        valor === null || valor === undefined || valor === '' ? '—' : String(valor);
      const fechasEjecucion = [
        this.formatearFecha(formato.formato1_fecha_ejecucion_desde),
        this.formatearFecha(formato.formato1_fecha_ejecucion_hasta)
      ].filter((fecha) => fecha !== '—').join(' - ') || '—';
      const opcionConCasilla = (etiqueta: string, seleccionada: boolean): any => ({
        columns: [
          {
            width: 10,
            canvas: [
              { type: 'rect', x: 0, y: 1, w: 8, h: 8, lineWidth: 0.8, lineColor: '#333333' },
              ...(seleccionada
                ? [
                  { type: 'line', x1: 1, y1: 5, x2: 3, y2: 7, lineWidth: 1.2, lineColor: '#6c1313' },
                  { type: 'line', x1: 3, y1: 7, x2: 7, y2: 2, lineWidth: 1.2, lineColor: '#6c1313' }
                ]
                : [])
            ]
          },
          { width: '*', text: etiqueta }
        ],
        columnGap: 4,
        margin: [0, 2, 0, 2]
      });
      const layoutCuadro = {
        hLineWidth: () => 0.7,
        vLineWidth: () => 0.7,
        paddingLeft: () => 5,
        paddingRight: () => 5,
        paddingTop: () => 4,
        paddingBottom: () => 4
      };
      const tablasNotificaciones = formato.notificaciones.map((notificacion) => {
        const notificado = notificacion.tipo_notificacion === 'individual'
          ? [notificacion.nombres_notificado, notificacion.apellidos_notificado].filter((valor) => !!valor).join(' ') || '—'
          : 'Notificación grupal';
        const mediosSeleccionados = new Set(
          (notificacion.medio_notificacion || '')
            .split(',')
            .map((medio) => medio.trim().toLowerCase())
        );
        const opcionesTipo = {
          columns: [
            opcionConCasilla('Individual', notificacion.tipo_notificacion === 'individual'),
            opcionConCasilla('Grupal', notificacion.tipo_notificacion === 'grupal')
          ],
          columnGap: 8
        };
        const opcionesMedio = {
          columns: [
            opcionConCasilla('WhatsApp', mediosSeleccionados.has('whatsapp')),
            opcionConCasilla('Email', mediosSeleccionados.has('email')),
            opcionConCasilla('Teléfono', mediosSeleccionados.has('telefono')),
            opcionConCasilla('Plataforma', mediosSeleccionados.has('plataforma'))
          ],
          columnGap: 5
        };
        const filasNotificacion: any[][] = [
          [
            { text: 'Fecha de notificación', style: 'tableHeader' },
            this.formatearFecha(notificacion.fecha_notificacion),
            { text: 'Tipo de notificación', style: 'tableHeader' },
            opcionesTipo
          ]
        ];
        if (notificacion.tipo_notificacion === 'individual') {
          filasNotificacion.push([
            { text: 'Nombres y apellidos', style: 'tableHeader' },
            { text: notificado, colSpan: 3 },
            {},
            {}
          ]);
        }
        filasNotificacion.push(
          [
            { text: 'Medio de notificación', style: 'tableHeader' },
            { ...opcionesMedio, colSpan: 3 },
            {},
            {}
          ],
          [
            { text: 'Detalle', style: 'tableHeader' },
            { text: mostrar(notificacion.detalle), colSpan: 3 },
            {},
            {}
          ]
        );
        return {
          table: {
            widths: [105, '*', 105, '*'],
            body: filasNotificacion
          },
          layout: layoutCuadro,
          margin: [0, 0, 0, 12]
        };
      });

      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 100, 40, 78],
        header: { image: encabezado, width: 515, alignment: 'center', margin: [0, 12, 0, 0] },
        footer: { image: pie, width: 515, alignment: 'center', margin: [0, 0, 0, 12] },
        content: [
          {
            text: 'REPORTE DE NOTIFICACIÓN',
            style: 'title'
          },
          {
            table: {
              widths: [75, '*', 75, '*', 75, '*'],
              body: [
                [
                  { text: 'Fecha elaboración', style: 'tableHeader' },
                  this.formatearFecha(formato.formato6_fecha_elaboracion),
                  { text: 'Código del curso', style: 'tableHeader' },
                  mostrar(formato.formato1_codigo_curso),
                  { text: 'Modalidad', style: 'tableHeader' },
                  mostrar(formato.formato6_modalidad)
                ],
                [
                  { text: 'Curso', style: 'tableHeader' },
                  { text: mostrar(formato.formato1_curso_definido), colSpan: 3 },
                  {},
                  {},
                  { text: 'Fecha de ejecución', style: 'tableHeader' },
                  fechasEjecucion
                ],
                [
                  { text: 'Módulo(s)', style: 'tableHeader' },
                  { text: mostrar(formato.formato6_modulos), colSpan: 2 },
                  {},
                  { text: 'Instructor-gestor', style: 'tableHeader' },
                  { text: `${mostrar(formato.instructor_nombres)} ${mostrar(formato.instructor_apellidos)}`, colSpan: 2 },
                  {}
                ],
                [
                  { text: 'Observaciones', style: 'tableHeader' },
                  { text: mostrar(formato.observaciones), colSpan: 5 },
                  {},
                  {},
                  {},
                  {}
                ]
              ]
            },
            layout: layoutCuadro,
            margin: [0, 0, 0, 14]
          },
          ...tablasNotificaciones.flat()
        ],
        styles: {
          title: { fontSize: 12, bold: true, alignment: 'center', margin: [0, 8, 0, 14] },
          tableHeader: { bold: true }
        },
        defaultStyle: { fontSize: 9 }
      };

      (pdfMake as any).createPdf(documento).open();
    } catch (error) {
      console.error('No se pudo generar el PDF del Formato 32:', error);
      Swal.fire('Error', 'No se pudo generar el PDF del Formato 32.', 'error');
    }
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

  private formatearFecha(valor: string | null | undefined): string {
    if (!valor) {
      return '—';
    }
    const fecha = new Date(`${valor.substring(0, 10)}T00:00:00`);
    return Number.isNaN(fecha.getTime())
      ? valor
      : fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private formatearFechaHora(valor: string | null | undefined): string {
    if (!valor) {
      return '—';
    }
    const fecha = new Date(valor.replace(' ', 'T'));
    return Number.isNaN(fecha.getTime())
      ? valor
      : fecha.toLocaleString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  }
}
