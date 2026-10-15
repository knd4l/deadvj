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
  formato6_modalidad: string | null;
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

      // --- Construir items del PDF ---
      const modalidad = formato.formato6_modalidad?.trim().toLocaleUpperCase('es-EC') || '—';
      const items: any[] = [{
        text: [
          'UNIVERSIDAD TÉCNICA DE AMBATO',
          'DIRECCIÓN DE EDUCACIÓN CONTINUA, A DISTANCIA Y VIRTUAL \n',
          'CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES',
          'UTA-DEADV-C-2026-006\n',
          'CURSO DE EDUCACIÓN CONTINUA',
          `MODALIDAD: ${modalidad}`
        ].join('\n'),
        bold: true,
        alignment: 'center',
        fontSize: 10,
        margin: [0, 0, 0, 14]
      }, ...formato.formato9_textos.map((texto) => ({
        text: texto,
        style: 'contractText',
        alignment: 'justify',
        margin: [0, 0, 0, 10]
      }))];

      // Detectar índice del párrafo NOVENA
      const idxNovena = formato.formato9_textos.findIndex((t) =>
        t.toUpperCase().includes('NOVENA')
      );

      if (idxNovena !== -1) {
        const cronograma: CronogramaModulo[] = Array.isArray(formato.formato9_cronograma)
          ? formato.formato9_cronograma : [];

        // Construir las fechas de clase siguiendo el cronograma del Formato 6.
        const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const nombresMeses = meses;
        const fechasTrabajo = new Map<string, { texto: string; horas: number; sincronico: boolean }>();
        cronograma.forEach((item) => {
          const diasSeleccionados = parsearDias(item.dias_horarios);
          const diasSemana = new Set(diasSeleccionados.map((dia) =>
            String(dia.dia || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
          ));
          const inicio = item.modulo_desde?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          const fin = item.modulo_hasta?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!inicio || !fin) return;

          const fechaInicio = Date.UTC(Number(inicio[1]), Number(inicio[2]) - 1, Number(inicio[3]));
          const fechaFin = Date.UTC(Number(fin[1]), Number(fin[2]) - 1, Number(fin[3]));
          const actividad = String(item.tipo_actividad || '').normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '').toLowerCase();
          const esSincronico = /\bsincronico\b/.test(actividad) || actividad.includes('clases en vivo');
          for (let fecha = fechaInicio; fecha <= fechaFin; fecha += 24 * 60 * 60 * 1000) {
            const fechaActual = new Date(fecha);
            const nombreDia = nombresDias[fechaActual.getUTCDay()];
            if (!diasSemana.has(nombreDia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())) continue;

            const fechaISO = fechaActual.toISOString().slice(0, 10);
            const [, mes, dia] = fechaISO.split('-');
            const nombreDiaTexto = nombreDia.toLowerCase();
            const clave = fechaISO;
            const horasPorDia = (horario: DiaHorario): number => {
              if (!horario.horaDesde || !horario.horaHasta) return 0;
              const [horaDesde, minutoDesde] = horario.horaDesde.split(':').map(Number);
              const [horaHasta, minutoHasta] = horario.horaHasta.split(':').map(Number);
              const minutosDesde = horaDesde * 60 + minutoDesde;
              const minutosHasta = horaHasta * 60 + minutoHasta;
              let diferencia = minutosHasta - minutosDesde;
              if (diferencia < 0) diferencia += 1440;
              return diferencia / 60;
            };
            const horas = diasSeleccionados
              .filter((horario) => String(horario.dia || '').normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() ===
                nombreDia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
              .reduce((total, horario) => total + horasPorDia(horario), 0);
            const registro = fechasTrabajo.get(clave) || {
              texto: `${nombreDiaTexto} ${Number(dia)} ${nombresMeses[Number(mes) - 1]}`,
              horas: 0,
              sincronico: false
            };
            registro.horas += horas;
            registro.sincronico = registro.sincronico || esSincronico;
            fechasTrabajo.set(clave, registro);
          }
        });

        const fechasOrdenadas = [...fechasTrabajo.entries()]
          .sort(([fechaA], [fechaB]) => fechaA.localeCompare(fechaB))
          .map(([, fecha]) => fecha);
        const diasTrabajo: any[] = fechasOrdenadas.length > 0
          ? fechasOrdenadas.flatMap((fecha, index) => {
              const horas = Number(fecha.horas.toFixed(2));
              const horasTexto = Number.isInteger(horas) ? String(horas) : String(horas).replace('.', ',');
              return [
                ...(index > 0 ? [{ text: '\n' }] : []),
                { text: fecha.texto, bold: fecha.sincronico },
                { text: ` (${horasTexto}h)` }
              ];
            })
          : [{ text: '—' }];

        // Horario de trabajo: tipo de actividad + días únicos + rango horario
        const horarioTexto = cronograma.length > 0
          ? cronograma.map((c) => {
              const dias = parsearDias(c.dias_horarios);
              const diasUnicos = [...new Set(dias.map((d) => d.dia))].join(', ');
              const rango = dias.length > 0 ? `${dias[0].horaDesde} - ${dias[dias.length - 1].horaHasta}` : '';
              return `${c.tipo_actividad}: ${diasUnicos}${rango ? ' ' + rango : ''}`;
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
          text: texto, bold: true,
          fontSize: 8, alignment: 'center', margin: [2, 4, 2, 4]
        });
        const dataCell = (texto: string, align: string = 'left'): any => ({
          text: texto, fontSize: 8, alignment: align, margin: [2, 3, 2, 3]
        });

        const tablaNovena: any = {
          table: {
            widths: [140, 40, 65, 120, 130],
            headerRows: 1,
            body: [
              [
                headerCell('Evento'),
                headerCell('Ciudad'),
                headerCell('Instalaciones'),
                headerCell('Días de Trabajo /\nHoras Efectivamente\nLaboradas'),
                headerCell('Horario de\nTrabajo')
              ],
              [
                { stack: eventoContent, fontSize: 8, margin: [2, 3, 2, 3] },
                dataCell('Ambato', 'center'),
                dataCell('Plataforma Educativa UTA', 'center'),
                { text: diasTrabajo, fontSize: 8, alignment: 'left', margin: [2, 3, 2, 3] },
                dataCell(horarioTexto, 'center')
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0.7,
            vLineWidth: () => 0.7,
            paddingLeft: () => 2,
            paddingRight: () => 2
          },
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
