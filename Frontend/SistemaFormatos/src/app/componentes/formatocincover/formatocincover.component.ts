import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-formatocincover',
  templateUrl: './formatocincover.component.html',
  styleUrls: ['./formatocincover.component.css']
})
export class FormatocincoverComponent implements OnInit {
  formatos: any[] = [];
  private registrosFormato5: any[] = [];
  cargando = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarFormatos();
  }

  cargarFormatos(): void {
    this.cargando = true;
    this.modulosService.obtenerFormatos5({ fx: 'getformato5', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargando = false;
        if (respuesta?.data?.success && Array.isArray(respuesta.data.item)) {
          this.registrosFormato5 = respuesta.data.item;
          const cursos = new Map<string, any>();
          this.registrosFormato5.forEach((registro: any) => {
            const key = String(registro.formato6_codigo ?? registro.formato5_codigo);
            const curso = cursos.get(key);
            if (curso) {
              curso.formato5_total_entrevistas += 1;
            } else {
              cursos.set(key, { ...registro, formato5_total_entrevistas: 1 });
            }
          });
          this.formatos = Array.from(cursos.values());
        } else {
          this.registrosFormato5 = [];
          this.formatos = [];
          if (respuesta?.data?.message) {
            Swal.fire('Error', respuesta.data.message, 'error');
          }
        }
      },
      error: () => {
        this.cargando = false;
        this.registrosFormato5 = [];
        this.formatos = [];
        Swal.fire('Error', 'No se pudieron cargar los registros del Formato 5.', 'error');
      }
    });
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

  async verReporte(formato: any): Promise<void> {
    try {
      const encabezado = await this.convertirImagenBase64('assets/img/encabezado.jpg');
      const pie = await this.convertirImagenBase64('assets/img/footer.jpeg');
      const fuentes = pdfFonts as any;
      (pdfMake as any).vfs = fuentes.pdfMake?.vfs || fuentes.vfs;

      const mostrar = (valor: any): string =>
        valor === null || valor === undefined || valor === '' ? '—' : String(valor);
      const formatearFecha = (valor: any): string => {
        if (valor === null || valor === undefined || valor === '') {
          return '—';
        }

        const fecha = new Date(valor);
        if (Number.isNaN(fecha.getTime())) {
          return mostrar(valor);
        }

        return fecha.toLocaleString('es-EC', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };
      const formatearFechaHora = (valor: any): string => {
        if (valor === null || valor === undefined || valor === '') {
          return '—';
        }

        const fecha = new Date(valor);
        if (Number.isNaN(fecha.getTime())) {
          return mostrar(valor);
        }

        return fecha.toLocaleString('es-EC', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', '');
      };
      const fechasEjecucion = [
        formatearFecha(formato.formato1_fecha_ejecucion_desde),
        formatearFecha(formato.formato1_fecha_ejecucion_hasta)
      ].filter((fecha) => fecha !== '—').join(' - ') || '—';
      const curso = [formato.formato1_codigo_curso, formato.formato1_curso_definido]
        .filter((valor) => valor !== null && valor !== undefined && valor !== '')
        .join(' - ') || '—';
      const modalidad = mostrar(formato.formato6_modalidad);
      const entrevistas = this.registrosFormato5
        .filter((registro) =>
          String(registro.formato6_codigo) === String(formato.formato6_codigo)
        )
        .sort((a, b) => Number(a.formato5_numero_entrevista) - Number(b.formato5_numero_entrevista));

      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 132, 40, 78],
        header: { image: encabezado, width: 515, alignment: 'center', margin: [0, 12, 0, 0] },
        footer: { image: pie, width: 515, alignment: 'center', margin: [0, 0, 0, 12] },
        content: [
          
          {
            table: {
              widths: [75, '*', 80, '*', 75, '*'],
              body: [
                [
                  { text: 'Fecha elaboración', style: 'tableHeader' },
                  { text: formatearFecha(formato.formato6_fecha_elaboracion) },
                  { text: 'Tipo de capacitación', style: 'tableHeader' },
                  { text: mostrar(formato.formato6_requerimiento) },
                  { text: 'Fecha de ejecución', style: 'tableHeader' },
                  { text: fechasEjecucion }
                ],
                [
                  { text: 'Curso', style: 'tableHeader' },
                  { text: curso, colSpan: 5 },
                  {},
                  {},
                  {},
                  {}
                ],
                [
                  { text: 'Modalidad', style: 'tableHeader' },
                  { text: modalidad, colSpan: 2 },
                  {},
                  { text: 'Área', style: 'tableHeader' },
                  { text: mostrar(formato.formato6_area), colSpan: 2 },
                  {}
                ]
              ]
            },
            layout: { hLineWidth: () => 0.7, vLineWidth: () => 0.7 },
            margin: [0, 0, 0, 14]
          },
       
          ...entrevistas.map((entrevista: any) => ({
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  { text: 'Entrevista', style: 'tableHeader' },
                  { text: mostrar(entrevista.formato5_numero_entrevista), colSpan: 3 },
                  {},
                  {}
                ],
                [
                  { text: 'Fecha y hora', style: 'tableHeader' },
                  formatearFechaHora(entrevista.formato5_fecha_creacion),
                  { text: 'Modalidad', style: 'tableHeader' },
                  modalidad
                ],
                [
                  { text: 'Apellidos y nombres', style: 'tableHeader' },
                  {
                    text: [entrevista.formato5_apellidos, entrevista.formato5_nombres]
                      .filter((valor: any) => valor !== null && valor !== undefined && valor !== '')
                      .join(' ') || '—',
                    colSpan: 3
                  },
                  {},
                  {}
                ],
                [
                  { text: 'CALIFICACIÓN', style: 'tableHeader', colSpan: 4, alignment: 'left' },
                  {},
                  {},
                  {}
                ],
                [
                  { text: 'Dominio temática', style: 'tableHeader' },
                  { text: 'Dominio aula', style: 'tableHeader' },
                  { text: 'Habilidades blandas', style: 'tableHeader' },
                  { text: 'Nota de entrevista', style: 'tableHeader' }
                ],
                [
                  mostrar(entrevista.formato5_dominio_tematica),
                  mostrar(entrevista.formato5_dominio_aula),
                  mostrar(entrevista.formato5_habilidades_blandas),
                  mostrar(entrevista.formato5_nota_entrevista)
                ],
                [
                  { text: 'Observaciones', style: 'tableHeader' },
                  { text: mostrar(entrevista.formato5_observaciones), colSpan: 3 },
                  {},
                  {}
                ]
              ]
            },
            layout: { hLineWidth: () => 0.7, vLineWidth: () => 0.7 },
            margin: [0, 0, 0, 14]
          }))
        ],
        styles: {
          title: { fontSize: 12, bold: true, alignment: 'center', margin: [0, -60, 0, 14] },
          sectionTitle: { fontSize: 12, bold: true, margin: [0, 4, 0, 8] },
          tableHeader: { bold: true }
        },
        defaultStyle: { fontSize: 10 }
      };

      (pdfMake as any).createPdf(documento).open();
    } catch (error) {
      console.error('No se pudo generar el reporte del Formato 5:', error);
      Swal.fire('Error', 'No se pudo generar el reporte PDF del Formato 5.', 'error');
    }
  }
}