import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

interface DiaHorario {
  dia: string;
  horaDesde: string;
  horaHasta: string;
}

interface CronogramaModulo {
  modulo_nombre: string;
  modulo_desde: string;
  modulo_hasta: string;
  tipo_actividad: string;
  dias_horarios: DiaHorario[] | string;
}

interface Formato9 {
  formato9_codigo: number;
  formato6_codigo: number;
  formato9_modulo_id: number;
  formato9_modulo_nombre: string;
  formato9_textos: string[];
  formato9_fecha_creacion: string;
  formato1_codigo_curso: string | null;
  formato1_curso_definido: string;
  formato9_cronograma?: CronogramaModulo[];
}

@Component({
  selector: 'app-formatonuevever',
  templateUrl: './formatonuevever.component.html',
  styleUrls: ['./formatonuevever.component.css']
})
export class FormatonueveverComponent implements OnInit {
  formatos: Formato9[] = [];
  cargando = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarFormatos();
  }

  cargarFormatos(): void {
    this.cargando = true;
    this.modulosService.obtenerFormatos9({ fx: 'getformato9', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargando = false;
        if (!respuesta?.data?.success || !Array.isArray(respuesta.data.item)) {
          this.formatos = [];
          Swal.fire('Error', respuesta?.data?.message || 'No se pudieron cargar los Formatos 9.', 'error');
          return;
        }
        this.formatos = respuesta.data.item;
      },
      error: (error: any) => {
        this.cargando = false;
        this.formatos = [];
        console.error('Error al cargar los Formatos 9:', error);
        Swal.fire('Error', 'No se pudieron cargar los Formatos 9.', 'error');
      }
    });
  }

  trackByFormato(index: number, formato: Formato9): number {
    return formato.formato9_codigo;
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

  async verReporte(formato: Formato9): Promise<void> {
    try {
      const encabezado = await this.convertirImagenBase64('assets/img/encabezado.jpg');
      const pie = await this.convertirImagenBase64('assets/img/footer.jpeg');
      const fuentes = pdfFonts as any;
      (pdfMake as any).vfs = fuentes.pdfMake?.vfs || fuentes.vfs;

      // --- Helpers ---
      const parsearDias = (raw: any): DiaHorario[] => {
        if (Array.isArray(raw)) return raw;
        try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
      };

      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

      const parsearFechaISO = (iso: string): { num: number; mes: string; anio: number } | null => {
        const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return null;
        return { num: parseInt(m[3], 10), mes: meses[parseInt(m[2], 10) - 1], anio: parseInt(m[1], 10) };
      };

      const agruparFechasPorMesAnio = (dias: DiaHorario[]): string => {
        const grupos = new Map<string, number[]>();
        for (const d of dias) {
          const p = parsearFechaISO(d.dia);
          if (!p) continue;
          const clave = `${p.mes}|${p.anio}`;
          if (!grupos.has(clave)) grupos.set(clave, []);
          grupos.get(clave)!.push(p.num);
        }
        return Array.from(grupos.entries())
          .map(([clave, nums]) => {
            const [mes, anio] = clave.split('|');
            return `${nums.join(', ')} de ${mes} de ${anio}`;
          }).join('; ') || '—';
      };

      const nombreDiaSemana = (iso: string): string => {
        const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return iso || '';
        const d = new Date(Date.UTC(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10)));
        return dias[d.getUTCDay()];
      };

      // --- Construir items del PDF ---
      const items: any[] = formato.formato9_textos.map((texto) => ({
        text: texto,
        style: 'contractText',
        alignment: 'justify',
        margin: [0, 0, 0, 10]
      }));

      // Detectar índice del párrafo NOVENA
      const idxNovena = formato.formato9_textos.findIndex((t) =>
        t.toUpperCase().includes('NOVENA')
      );

      if (idxNovena !== -1) {
        const cronograma: CronogramaModulo[] = Array.isArray(formato.formato9_cronograma)
          ? formato.formato9_cronograma : [];

        const todosLosDias: DiaHorario[] = cronograma.flatMap((c) => parsearDias(c.dias_horarios));

        // Días de contratación: fechas agrupadas
        const diasContratacion = agruparFechasPorMesAnio(todosLosDias);

        // Días de trabajo: día de semana + rango horario sin duplicados
        const diasTrabajo = todosLosDias.length > 0
          ? [...new Map(todosLosDias.map((d) => {
              const k = `${nombreDiaSemana(d.dia)} ${d.horaDesde}-${d.horaHasta}`;
              return [k, k];
            })).values()].join('\n')
          : '—';

        // Horario de trabajo: por tipo de actividad
        const horarioTexto = cronograma.length > 0
          ? cronograma.map((c) => {
              const dias = parsearDias(c.dias_horarios);
              const rango = dias.length > 0 ? `${dias[0].horaDesde} - ${dias[dias.length - 1].horaHasta}` : '';
              return `${c.tipo_actividad}${rango ? ': ' + rango : ''}`;
            }).join('\n')
          : '—';

        // Evento: "Módulo N\nTítulo del módulo" separado del nombre del curso
        const numModulo = formato.formato9_modulo_id ?? '';
        const tituloModulo = formato.formato9_modulo_nombre || '';
        // Detectar si el nombre ya empieza con "Módulo N" para no repetirlo
        const esNombreGenerico = /^[Mm][oó]dulo\s+\d+$/.test(tituloModulo.trim());
        const lineaModulo = esNombreGenerico
          ? tituloModulo.trim()
          : `Módulo ${numModulo}: ${tituloModulo}`;

        const eventoContent: any[] = [
          { text: (formato.formato1_curso_definido || '—') + '\n', bold: false },
          { text: '\n' },
          { text: lineaModulo, bold: true }
        ];

        const headerCell = (texto: string): any => ({
          text: texto, bold: true, color: 'white', fillColor: '#00345e',
          fontSize: 9, alignment: 'center', margin: [2, 4, 2, 4]
        });
        const dataCell = (texto: string, align: string = 'left'): any => ({
          text: texto, fontSize: 9, alignment: align, margin: [3, 3, 3, 3]
        });

        const tablaNovena: any = {
          table: {
            widths: ['*', 48, 88, 80, 82, 82],
            headerRows: 1,
            body: [
              [
                headerCell('Evento'),
                headerCell('Ciudad'),
                headerCell('Instalaciones'),
                headerCell('Días de\nContratación'),
                headerCell('Días de Trabajo /\nHoras Efectivamente\nLaboradas'),
                headerCell('Horario de\nTrabajo')
              ],
              [
                { text: eventoContent, fontSize: 9, margin: [3, 3, 3, 3] },
                dataCell('Ambato', 'center'),
                dataCell('Plataforma Educativa UTA', 'center'),
                dataCell(diasContratacion, 'center'),
                dataCell(diasTrabajo, 'center'),
                dataCell(horarioTexto)
              ]
            ]
          },
          layout: { hLineWidth: () => 0.7, vLineWidth: () => 0.7 },
          margin: [0, 0, 0, 10]
        };

        items.splice(idxNovena + 1, 0, tablaNovena);
      }

      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 132, 40, 78],
        header: { image: encabezado, width: 515, alignment: 'center', margin: [0, 12, 0, 0] },
        footer: { image: pie, width: 515, alignment: 'center', margin: [0, 0, 0, 12] },
        content: items,
        styles: {
          contractText: { fontSize: 10, lineHeight: 1.2, alignment: 'justify' }
        },
        defaultStyle: { fontSize: 10 }
      };

      (pdfMake as any).createPdf(documento).open();
    } catch (error) {
      console.error('No se pudo generar el reporte del Formato 9:', error);
      Swal.fire('Error', 'No se pudo generar el reporte PDF del Formato 9.', 'error');
    }
  }
}
