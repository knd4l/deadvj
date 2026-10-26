import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { firstValueFrom } from 'rxjs';

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

interface DatosDirector {
  tit_dir?: string | null;
  nom_dir?: string | null;
  ape_dir?: string | null;
  cedula?: string | number | null;
}

interface DatosAutoridad {
  titulo?: string | null;
  nom_aut?: string | null;
  ape_aut?: string | null;
  cedula?: string | number | null;
}

interface RespuestaFirmante<T> {
  data?: {
    success?: boolean;
    message?: string;
    item?: T[];
  };
}

interface Firmante {
  nombre: string;
  cargo: string;
  cedula: string;
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
  codigoReporte = 'UTA-DEADV-C-2025-001';
  generandoReporte = false;

  private readonly claveCodigoReporte = 'formatonuevever_codigo_reporte';

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.codigoReporte = localStorage.getItem(this.claveCodigoReporte) || this.codigoReporte;
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
        this.formatos = this.obtenerFormatosMasRecientes(respuesta.data.item);
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

  private crearContenidoDiasTrabajo(
    fechas: Array<{ texto: string; horas: number; sincronico: boolean }>
  ): any[] {
    if (fechas.length === 0) {
      return [{ text: '—' }];
    }

    return fechas.flatMap((fecha, index) => {
      const horas = Number(fecha.horas.toFixed(2));
      const horasTexto = Number.isInteger(horas) ? String(horas) : String(horas).replace('.', ',');
      return [
        ...(index > 0 ? [{ text: '\n' }] : []),
        {
          text: `${fecha.texto} (${horasTexto}h)`,
          bold: fecha.sincronico,
          noWrap: true
        }
      ];
    });
  }

  private obtenerFormatosMasRecientes(formatos: Formato9[]): Formato9[] {
    const formatosPorModulo = new Map<string, Formato9>();
    const fechaComoNumero = (formato: Formato9): number => {
      const fecha = Date.parse(formato.formato9_fecha_creacion);
      return Number.isNaN(fecha) ? Number.NEGATIVE_INFINITY : fecha;
    };

    formatos.forEach((formato) => {
      const clave = `${formato.formato6_codigo}-${formato.formato9_modulo_id}`;
      const existente = formatosPorModulo.get(clave);
      if (
        !existente ||
        fechaComoNumero(formato) > fechaComoNumero(existente) ||
        (fechaComoNumero(formato) === fechaComoNumero(existente) &&
          formato.formato9_codigo > existente.formato9_codigo)
      ) {
        formatosPorModulo.set(clave, formato);
      }
    });

    return Array.from(formatosPorModulo.values());
  }

  private formatearTextoContrato(texto: string, nombreCurso: string, indiceTexto: number): any[] {
    const coincidencias: { inicio: number; fin: number }[] = [];
    const agregarCoincidencias = (expresion: RegExp): void => {
      let coincidencia: RegExpExecArray | null;
      while ((coincidencia = expresion.exec(texto)) !== null) {
        coincidencias.push({
          inicio: coincidencia.index,
          fin: coincidencia.index + coincidencia[0].length
        });
      }
    };
    const ordinal = /^D[ÉE]CIMA\s+(?:QUINTA|CUARTA|TERCERA|SEGUNDA|PRIMERA)|^D[ÉE]CIMA|^NOVENA|^OCTAVA|^S[ÉE]PTIMA|^SEXTA|^QUINTA|^CUARTA|^TERCERA|^SEGUNDA|^PRIMERA/gi;

    agregarCoincidencias(ordinal);
    agregarCoincidencias(/\bCL[ÁA]USULA\s+TERCERA\b/gi);
    if (nombreCurso.trim()) {
      const cursoEscapado = nombreCurso.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      agregarCoincidencias(new RegExp(cursoEscapado, 'gi'));
    }
    if (indiceTexto === 4) {
      agregarCoincidencias(/\bUSD\s*\d+(?:[.,]\d{2})?\b/gi);
      agregarCoincidencias(/\b\d+(?:[.,]\d+)?\s+horas?\b/gi);
    }

    coincidencias.sort((a, b) => a.inicio - b.inicio || b.fin - a.fin);
    const fragmentos: any[] = [];
    let cursor = 0;
    coincidencias.forEach(({ inicio, fin }) => {
      if (inicio < cursor) {
        return;
      }
      if (inicio > cursor) {
        fragmentos.push({ text: texto.slice(cursor, inicio) });
      }
      fragmentos.push({ text: texto.slice(inicio, fin), bold: true });
      cursor = fin;
    });
    if (cursor < texto.length) {
      fragmentos.push({ text: texto.slice(cursor) });
    }
    return fragmentos.length ? fragmentos : [{ text: texto }];
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

  private obtenerRegistroFirmante<T>(respuesta: RespuestaFirmante<T>, entidad: string): T {
    if (!respuesta.data?.success) {
      throw new Error(respuesta.data?.message || `No se pudieron consultar los datos de ${entidad}.`);
    }
    const registro = respuesta.data.item?.[0];
    if (!registro) {
      throw new Error(`No se encontró ${entidad} para las firmas del contrato.`);
    }
    return registro;
  }

  private crearFirmante(nombrePartes: Array<string | null | undefined>, cargo: string, cedulaValor: string | number | null | undefined, entidad: string): Firmante {
    const nombre = nombrePartes.map((parte) => parte?.trim()).filter(Boolean).join(' ');
    const cedula = cedulaValor === null || cedulaValor === undefined ? '' : String(cedulaValor).trim();
    if (!nombre || !cedula) {
      throw new Error(`Falta el nombre o la C.I. de ${entidad} en la base de datos.`);
    }
    return { nombre, cargo, cedula };
  }

  private crearBloqueFirmas(director: Firmante, profesional: Firmante): any {
    const celdaFirma = (firmante: Firmante): any => ({
      stack: [
        { text: firmante.nombre, alignment: 'center', margin: [0, 65, 0, 0] },
        { text: firmante.cargo, alignment: 'center', margin: [0, 2, 0, 0] },
        { text: `C.I. ${firmante.cedula}`, alignment: 'center', margin: [0, 2, 0, 0] }
      ],
      fontSize: 9,
      margin: [8, 0, 8, 0]
    });

    return {
      unbreakable: true,
      stack: [
        {
          table: {
            widths: ['*', '*'],
            body: [[celdaFirma(director), celdaFirma(profesional)]]
          },
          layout: 'noBorders'
        },
        {
          text: [
            { text: 'NIVEL DE SENSIBILIZACIÓN DE INFORMACIÓN: ' },
            { text: 'ALTO', bold: true }
          ],
          fontSize: 8,
          margin: [0, 24, 0, 0]
        }
      ],
      margin: [0, 36, 0, 0]
    };
  }

  private obtenerCodigoReporte(formato: Formato9): string {
    const claveFormato = `${this.claveCodigoReporte}_formato_${formato.formato9_codigo}`;
    const codigoGuardado = localStorage.getItem(claveFormato);
    if (codigoGuardado) {
      return codigoGuardado;
    }

    const prefijo = /^(.*-\d{4}-)\d+$/.exec(this.codigoReporte.trim());
    if (!prefijo) {
      throw new Error('Use el formato UTA-DEADV-C-2025-001 en la pantalla de creación del Formato 9.');
    }
    const codigoAsignado = `${prefijo[1]}${String(formato.formato9_codigo).padStart(3, '0')}`;
    localStorage.setItem(claveFormato, codigoAsignado);
    return codigoAsignado;
  }

  async verReporte(formato: Formato9): Promise<void> {
    if (this.generandoReporte) {
      return;
    }
    this.generandoReporte = true;
    try {
      const codigoReporte = this.obtenerCodigoReporte(formato);
      const [encabezado, pie, respuestaDirectores, respuestaAutoridades] = await Promise.all([
        this.convertirImagenBase64('assets/img/encabezado.jpg'),
        this.convertirImagenBase64('assets/img/footer.jpeg'),
        firstValueFrom(this.modulosService.obtenerDirectores({ fx: 'getdirectores', d: {} })),
        firstValueFrom(this.modulosService.obtenerAutoridades({ fx: 'getautoridades', d: {} }))
      ]);
      const registroDirector = this.obtenerRegistroFirmante<DatosDirector>(respuestaDirectores, 'el director');
      const registroAutoridad = this.obtenerRegistroFirmante<DatosAutoridad>(respuestaAutoridades, 'la autoridad');
      const director = this.crearFirmante(
        [registroDirector.tit_dir, registroDirector.nom_dir, registroDirector.ape_dir],
        'Directora de Educación Continua a Distancia y Virtual',
        registroDirector.cedula,
        'el director'
      );
      const profesional = this.crearFirmante(
        [registroAutoridad.titulo, registroAutoridad.nom_aut, registroAutoridad.ape_aut],
        'PROFESIONAL',
        registroAutoridad.cedula,
        'la autoridad'
      );
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
          `${codigoReporte}\n`,
          'CURSO DE EDUCACIÓN CONTINUA',
          `MODALIDAD: ${modalidad}`
        ].join('\n'),
        bold: true,
        alignment: 'center',
        fontSize: 10,
        margin: [0, 0, 0, 14]
      }, ...formato.formato9_textos.map((texto, indice) => ({
        text: this.formatearTextoContrato(texto, formato.formato1_curso_definido || '', indice),
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
        const diasContratacionPorMes = new Map<string, Set<number>>();
        fechasTrabajo.forEach((_fecha, fechaISO) => {
          const [anio, mes, dia] = fechaISO.split('-').map(Number);
          const claveMes = `${anio}-${String(mes).padStart(2, '0')}`;
          if (!diasContratacionPorMes.has(claveMes)) {
            diasContratacionPorMes.set(claveMes, new Set<number>());
          }
          diasContratacionPorMes.get(claveMes)?.add(dia);
        });
        const diasContratacion = [...diasContratacionPorMes.entries()]
          .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
          .map(([claveMes, dias]) => {
            const [anio, mes] = claveMes.split('-').map(Number);
            return `${[...dias].sort((a, b) => a - b).join(', ')} de ${meses[mes - 1]} de ${anio}`;
          })
          .join('; ') || '—';
        const diasTrabajo = this.crearContenidoDiasTrabajo(fechasOrdenadas);

        // Horario de trabajo: tipo de actividad + días únicos + rango horario
        const horarioContenido: any[] = [
          { text: 'Conexión Virtual\n', bold: true },
          ...(cronograma.length > 0
            ? cronograma.flatMap((c, index) => {
              const dias = parsearDias(c.dias_horarios);
              const diasUnicos = [...new Set(dias.map((d) => d.dia))].join(', ');
              const rango = dias.length > 0 ? `${dias[0].horaDesde} - ${dias[dias.length - 1].horaHasta}` : '';
              const tipoActividad = String(c.tipo_actividad || '');
              const tipoNormalizado = tipoActividad.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
              const destacarTipo = /clases?\s+en\s+vivo|sincron/.test(tipoNormalizado)
                || /trabajo\s+autonomo|asincron/.test(tipoNormalizado);
              return [
                ...(index > 0 ? [{ text: '\n' }] : []),
                { text: tipoActividad, bold: destacarTipo },
                { text: `: ${diasUnicos}${rango ? ' ' + rango : ''}` }
              ];
            })
            : [{ text: '—' }])
        ];

        // Evento: "Módulo N\nTítulo del módulo" separado del nombre del curso
        const numModulo = formato.formato9_modulo_id ?? '';
        const tituloModulo = formato.formato9_modulo_nombre || '';
        // Detectar si el nombre ya empieza con "Módulo N" para no repetirlo
        const esNombreGenerico = /^[Mm][oó]dulo\s+\d+$/.test(tituloModulo.trim());
        const lineaModulo = esNombreGenerico
          ? tituloModulo.trim()
          : `Módulo ${numModulo}: ${tituloModulo}`;

        const coincidenciaModulo = /^(M[oó]dulo\s+\d+)/i.exec(lineaModulo);
        const moduloNumero = coincidenciaModulo?.[0] || `Módulo ${numModulo}`;
        const moduloEspecifico = lineaModulo.slice(moduloNumero.length);
        const moduloContent: any[] = [
          { text: moduloNumero, bold: true },
          { text: moduloEspecifico }
        ];
        const eventoContent: any[] = [
          { text: (formato.formato1_curso_definido || '—') + '\n', bold: true },
          { text: '\n' },
          { text: moduloContent }
        ];

        const headerCell = (texto: string): any => ({
          text: texto, bold: true,
          fontSize: 8, alignment: 'center', margin: [2, 4, 2, 4]
        });
        const dataCell = (texto: string): any => ({
          text: texto, fontSize: 8, alignment: 'center', margin: [2, 3, 2, 3]
        });

        const tablaNovena: any = {
          table: {
            widths: [110, 35, 55, 75, 130, 80],
            headerRows: 1,
            body: [
              [
                headerCell('Evento'),
                headerCell('Ciudad'),
                headerCell('Instalaciones'),
                headerCell('Días de Contratación'),
                headerCell('Días de Trabajo /\nHoras Efectivamente\nLaboradas'),
                headerCell('Horario de\nTrabajo')
              ],
              [
                { stack: eventoContent, fontSize: 8, alignment: 'center', margin: [2, 3, 2, 3] },
                dataCell('Ambato'),
                dataCell('Plataforma Educativa UTA'),
                dataCell(diasContratacion),
                { text: diasTrabajo, fontSize: 8, alignment: 'center', margin: [2, 3, 2, 3] },
                { text: horarioContenido, fontSize: 8, alignment: 'center', margin: [2, 3, 2, 3] }
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

        items.splice(idxNovena + 2, 0, tablaNovena);
      }

      items.push(this.crearBloqueFirmas(director, profesional));

      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 85, 40, 78],
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
      Swal.fire(
        'Error',
        error instanceof Error ? error.message : 'No se pudo generar el reporte PDF del Formato 9.',
        'error'
      );
    } finally {
      this.generandoReporte = false;
    }
  }
}
