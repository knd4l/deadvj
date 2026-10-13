import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ModulosService } from '../../servicios/modulos.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-formatoseisver',
  templateUrl: './formatoseisver.component.html',
  styleUrls: ['./formatoseisver.component.css']
})
export class FormatoseisverComponent implements OnInit {

  
  listaformatos6: any[] = []; // LISTA DE FORMATOS 6

  // PAGINACIÓN

  pages: number = 1;

  constructor(
    private modulosService: ModulosService
  ) {}

  ngOnInit(): void {

    // CAMBIO: cargar los Formatos 6 al iniciar
    this.cargarListaFormatos6();

  }

  //Convierte la imagen a base 64

  convertirImagenBase64(url: string): Promise<string> {

  return fetch(url)
    .then(response => {

      if (!response.ok) {
        throw new Error(
          `No se pudo cargar la imagen: ${url}`
        );
      }

      return response.blob();
    })
    .then(blob => {

      return new Promise<string>((resolve, reject) => {

        const lector =
          new FileReader();

        lector.onloadend = () => {

          if (typeof lector.result === 'string') {

            resolve(lector.result);

          } else {

            reject(
              'No se pudo convertir la imagen a Base64'
            );

          }

        };

        lector.onerror = () => {

          reject(
            'Error al leer la imagen'
          );

        };

        lector.readAsDataURL(blob);

      });

    });

}

  // =====================================================
  // CARGAR FORMATOS 6
  // =====================================================

  cargarListaFormatos6(): void {

    const data = {

      fx: 'getformato6',

      d: {},

      dpro: 0,

      dus: 0,

      dcx: 1

    };

    console.log('================================');
    console.log('CONSULTANDO FORMATOS 06');
    console.log('DATOS ENVIADOS:', data);
    console.log('================================');

    this.modulosService
      .obtenerFormato6(data)
      .subscribe({

        next: (res: any) => {

          console.log('RESPUESTA FORMATOS 06:',res);
          console.log('TIPO DE RESPUESTA:', typeof res);
          console.log('ES ARRAY:', Array.isArray(res));
          console.log('DATOS:', JSON.stringify(res, null, 2));

          if (res && res.data && res.data.success && Array.isArray(res.data.item)) 
            {

            this.listaformatos6 =res.data.item;

            console.log('FORMATOS 06 ENCONTRADOS:',this.listaformatos6.length);
            
            console.table(this.listaformatos6);

          } else {

            this.listaformatos6 = [];

            console.warn('No existen registros de Formato 06');

          }

        },

        error: (err: HttpErrorResponse) => {

          console.error(
            'ERROR AL CONSULTAR FORMATOS 06:',
            err
          );

          this.listaformatos6 = [];

          Swal.fire(
            'Error',
            'No se pudieron cargar los registros de Formato 06',
            'error'
          );

        }

      });

  }

  private construirArbolContenidos(registros: any[]): any[] {
    const nodos = new Map<number, any>();
    registros.forEach((registro, indice) => {
      const id = Number(registro?.contenido_id) || indice + 1;
      const orden = registro && typeof registro === 'object' && registro.orden !== null
        ? Number(registro.orden)
        : indice;
      nodos.set(id, {
        id,
        texto: typeof registro === 'string'
          ? registro.trim()
          : String(registro?.contenido ?? registro?.texto ?? '').trim(),
        padreId: registro && typeof registro === 'object' && registro.contenido_padre_id !== null
          ? Number(registro.contenido_padre_id)
          : null,
        orden: Number.isFinite(orden) ? orden : indice,
        hijos: []
      });
    });

    const raices: any[] = [];
    nodos.forEach((nodo) => {
      const padre = nodo.padreId === null ? undefined : nodos.get(nodo.padreId);
      if (padre) {
        padre.hijos.push(nodo);
      } else {
        raices.push(nodo);
      }
    });

    const ordenar = (lista: any[]): void => {
      lista.sort((a, b) => a.orden - b.orden || a.id - b.id);
      lista.forEach((nodo) => ordenar(nodo.hijos));
    };
    ordenar(raices);
    return raices;
  }

  // =====================================================
  // VER FORMATO 6
  // =====================================================

  verFormulario6(formato: any): void {

  const data = {

    fx: 'getformato6Reporte',

    d: {
      formato6_codigo: formato.formato6_codigo
    },

    dpro: 0,
    dus: 0,
    dcx: 1

  };

  this.modulosService.obtenerFormato6Reporte(data).subscribe({next: (res: any) => {

        console.log('DATOS PARA REPORTE:', res);

        if (
          res &&
          res.data &&
          res.data.success &&
          res.data.item &&
          res.data.item.length > 0
        ) {

          const formatoCompleto = res.data.item[0];

          console.log('========== DATOS PDF ==========');
          console.log('FORMATO:', formatoCompleto);
          console.log('MÓDULOS:', formatoCompleto.modulos);
          console.log('CONTENIDOS:', formatoCompleto.contenidos);
          console.log('HORARIOS DEBUG:', formatoCompleto.horarios_debug);
          console.log('================================');

          // AQUÍ GENERAREMOS EL PDF
          this.generarPDFFormato6(formatoCompleto);

        } else {

          Swal.fire(
            'Error',
            res?.data?.message || 'No se encontraron los datos del Formato 6',
            'error'
          );

        }

      },

      error: (error: any) => {

        console.error(
          'Error al obtener Formato 6 para reporte:',
          error
        );

        Swal.fire(
          'Error',
          'No se pudieron obtener los datos del Formato 6',
          'error'
        );

      }

    });

}

 private imagenBase64(ruta: string): Promise<string> {
  return new Promise((resolve, reject) => {

    const imagen = new Image();

    imagen.onload = () => {

      const canvas = document.createElement('canvas');

      canvas.width = imagen.naturalWidth;
      canvas.height = imagen.naturalHeight;

      const contexto = canvas.getContext('2d');

      if (!contexto) {
        reject('No se pudo crear el contexto del canvas');
        return;
      }

      contexto.drawImage(imagen, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };

    imagen.onerror = () => {
      reject(`No se pudo cargar la imagen: ${ruta}`);
    };

    imagen.src = ruta;
  });
}

// =====================================================
// GENERAR PDF FORMATO 6
// =====================================================

async generarPDFFormato6(formato: any): Promise<void> {

  try {

    // =====================================================
    // CONFIGURACIÓN GENERAL
    // =====================================================

    const encabezado =
      await this.convertirImagenBase64(
        'assets/img/encabezado.jpg'
      );

    const pie =
      await this.convertirImagenBase64(
        'assets/img/footer.jpeg'
      );

    console.log(
      'ENCABEZADO BASE64:',
      encabezado.substring(0, 80)
    );

    console.log(
      'PIE BASE64:',
      pie.substring(0, 80)
    );


    // =====================================================
    // FUNCIÓN PARA TÍTULOS DE SECCIÓN
    // =====================================================

    const escaparTextoSvg = (texto: string): string =>
      texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const tituloSeccion = (
      texto: string
    ) => {

      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="515" height="30" viewBox="0 0 515 30"><rect x="1" y="1" width="513" height="28" rx="7" fill="none" stroke="#00345e" stroke-width="1.5"/><text x="9" y="20" font-family="Roboto, Arial, sans-serif" font-size="12" font-weight="700" fill="#000000">${escaparTextoSvg(texto)}</text></svg>`,
        width: 515,
        height: 30,
        margin: [0, 8, 0, 8]
      };

    };


    // =====================================================
    // DATOS
    // =====================================================

    const objetivosEspecificos =
      Array.isArray(
        formato?.objetivos_especificos
      )
        ? formato.objetivos_especificos
        : [];

    const objetivosEspecificosTexto = objetivosEspecificos
      .map((item: any) => String(item?.objetivo || '').trim())
      .filter((objetivo: string) => objetivo !== '')
      .map((objetivo: string) => ({
        text: `● ${objetivo}`,
        margin: [36, 0, 0, 5]
      }));


    const contenidos =
      Array.isArray(
        formato?.contenidos
      )
        ? formato.contenidos
        : [];


    const horariosDebug =
      Array.isArray(
        formato?.horarios_debug
      )
        ? formato.horarios_debug
        : [];


    const presupuesto =
      Array.isArray(
        formato?.presupuesto
      )
        ? formato.presupuesto
        : [];


    console.log(
      'HORARIOS PARA PDF:',
      horariosDebug
    );

    console.log(
      'CONTENIDOS PARA PDF:',
      contenidos
    );

    console.log(
      'PRESUPUESTO PARA PDF:',
      presupuesto
    );


    // =====================================================
    // FUNCIONES AUXILIARES
    // =====================================================

    const formatearFecha = (
      fecha: string
    ): string => {

      if (!fecha) {
        return '';
      }

      const partes =
        fecha.split('-');

      if (partes.length !== 3) {
        return fecha;
      }

      const anio =
        Number(partes[0]);

      const mes =
        Number(partes[1]) - 1;

      const dia =
        Number(partes[2]);

      const fechaObj =
        new Date(
          anio,
          mes,
          dia
        );

      const meses = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
      ];

      return `${dia} de ${meses[fechaObj.getMonth()]} de ${anio}`;

    };


    const obtenerNombreDia = (
      fecha: Date
    ): string => {

      const dias = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
      ];

      return dias[
        fecha.getDay()
      ];

    };


    const obtenerDiasHorarios = (
      horario: any
    ): any[] => {

      if (!horario?.dias_horarios) {
        return [];
      }

      try {

        if (
          Array.isArray(
            horario.dias_horarios
          )
        ) {

          return horario.dias_horarios;

        }

        const datos =
          JSON.parse(
            horario.dias_horarios
          );

        return Array.isArray(datos)
          ? datos
          : [];

      } catch (error) {

        console.error(
          'ERROR AL LEER DIAS_HORARIOS:',
          error
        );

        return [];

      }

    };


    const calcularHoras = (
      horaDesde: string,
      horaHasta: string
    ): number => {

      if (
        !horaDesde ||
        !horaHasta
      ) {
        return 0;
      }

      const partesDesde =
        horaDesde.split(':');

      const partesHasta =
        horaHasta.split(':');

      const minutosDesde =
        Number(partesDesde[0]) * 60 +
        Number(partesDesde[1]);

      const minutosHasta =
        Number(partesHasta[0]) * 60 +
        Number(partesHasta[1]);

      let diferencia =
        minutosHasta -
        minutosDesde;

      if (diferencia < 0) {
        diferencia += 1440;
      }

      return diferencia / 60;

    };


    // =====================================================
    // 1. PERÍODOS
    // =====================================================

    const inscripcionDesde =
      formato.inscripcion_matricula_desde || '';


    const inscripcionHasta =
      formato.inscripcion_matricula_hasta || '';


    let ejecucionDesde = '';
    let ejecucionHasta = '';


    if (
      horariosDebug.length > 0
    ) {

      ejecucionDesde =
        horariosDebug[0]?.ejecucion_desde || '';

      ejecucionHasta =
        horariosDebug[0]?.ejecucion_hasta || '';

    }

    const periodosPorModulo = new Map<string, {
      nombre: string;
      desde: string;
      hasta: string;
      orden: number;
    }>();

    const obtenerClaveModulo = (modulo: any, index: number): string => {
      const id = modulo.modulo_id || modulo.moduloId || modulo.id;
      const nombre = String(modulo.modulo_nombre || modulo.nombre || '').trim();
      const numeroNombre = nombre.match(/\d+/)?.[0];
      return String(numeroNombre || nombre || id || index + 1).toLowerCase();
    };

    const registrarPeriodoModulo = (
      modulo: any,
      index: number,
      fuenteHorario: boolean
    ): void => {
      const clave = obtenerClaveModulo(modulo, index);
      const nombre = String(modulo.modulo_nombre || modulo.nombre || '').trim();
      const periodo = periodosPorModulo.get(clave);

      if (!periodo) {
        periodosPorModulo.set(clave, {
          nombre: nombre || `Módulo ${index + 1}`,
          desde: modulo.modulo_desde || modulo.desde || '',
          hasta: modulo.modulo_hasta || modulo.hasta || '',
          orden: index
        });
        return;
      }

      if (nombre && /^Módulo \d+$/i.test(periodo.nombre)) {
        periodo.nombre = nombre;
      }
      if (!periodo.desde) {
        periodo.desde = modulo.modulo_desde || modulo.desde || '';
      }
      if (!periodo.hasta) {
        periodo.hasta = modulo.modulo_hasta || modulo.hasta || '';
      }
      if (fuenteHorario && periodo.orden > index) {
        periodo.orden = index;
      }
    };

    (Array.isArray(formato?.modulos) ? formato.modulos : [])
      .forEach((modulo: any, index: number) => registrarPeriodoModulo(modulo, index, false));
    horariosDebug.forEach((horario: any, index: number) =>
      registrarPeriodoModulo(horario, index, true)
    );

    const periodosModulos = Array.from(periodosPorModulo.values())
      .sort((a, b) => a.orden - b.orden)
      .map((modulo, index) => {
        const nombre = /^Módulo \d+$/i.test(modulo.nombre)
          ? ''
          : ` ${modulo.nombre}`;
        return {
          nombre: `Módulo ${index + 1}${nombre}: `,
          fechas: `${formatearFecha(modulo.desde)} al ${formatearFecha(modulo.hasta)}`
        };
      });

    const textoPeriodos = [
      { text: 'INSCRIPCIONES Y MATRÍCULAS:\n' },
      { text: `${formatearFecha(inscripcionDesde)} al ${formatearFecha(inscripcionHasta)}\n` },
      { text: 'EJECUCIÓN DEL CURSO:\n' },
      {
        text: `${formatearFecha(ejecucionDesde)} al ${formatearFecha(ejecucionHasta)}\n`,
        color: '#ab171f'
      },
      ...periodosModulos.flatMap((periodo, index) => [
        ...(index > 0 ? [{ text: '\n' }] : []),
        { text: periodo.nombre },
        { text: periodo.fechas, bold: true }
      ])
    ];

    const modalidadFormato1 =
      String(
        formato?.formato1_modalidad_nombre ||
        formato?.formato6_modalidad ||
        ''
      ).trim();

    const esElearning =
      /e[\s-]?learning/i.test(modalidadFormato1);

    const lineaModalidad = modalidadFormato1
      ? `Modalidad ${modalidadFormato1}`
      : '';

    const acreditacionOriginal =
      String(formato?.formato6_acreditacion || '');

    const acreditacionConModalidadBase = lineaModalidad
      ? /modalidad[^\r\n]*/i.test(acreditacionOriginal)
        ? acreditacionOriginal.replace(
            /modalidad[^\r\n]*/i,
            lineaModalidad
          )
        : `${acreditacionOriginal}${acreditacionOriginal ? '\n' : ''}${lineaModalidad}`
      : acreditacionOriginal;

      const acreditacionConModalidad = esElearning
        ? `${acreditacionConModalidadBase.trimEnd()}\n(e-learning)`
        : acreditacionConModalidadBase;


    // =====================================================
    // 2. HORARIO
    // =====================================================

    const horariosPorActividad = new Map<string, Map<string, string[]>>();

    horariosDebug.forEach((horario: any) => {
      if (!horario.tipo_actividad) {
        return;
      }

      const tipoActividad = String(horario.tipo_actividad).trim();
      let horariosActividad = horariosPorActividad.get(tipoActividad);
      if (!horariosActividad) {
        horariosActividad = new Map();
        horariosPorActividad.set(tipoActividad, horariosActividad);
      }

      const diasHorario = obtenerDiasHorarios(horario);
      diasHorario.forEach((diaHorario: any) => {
        const horaDesde = String(diaHorario.horaDesde || '').trim();
        const horaHasta = String(diaHorario.horaHasta || '').trim();
        const claveHorario = `${horaDesde}\u0000${horaHasta}`;
        let dias = horariosActividad?.get(claveHorario);
        if (!dias) {
          dias = [];
          horariosActividad?.set(claveHorario, dias);
        }

        const dia = String(diaHorario.dia || '').trim();
        if (dia && !dias.includes(dia)) {
          dias.push(dia);
        }
      });

      if (diasHorario.length === 0 && !horariosActividad.has('\u0000')) {
        horariosActividad.set('\u0000', []);
      }
    });

    const ordenDias: { [dia: string]: number } = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6
    };
    const actividadesHorario = Array.from(horariosPorActividad.entries())
      .map(([tipo, horarios]) => {
        const detalles = Array.from(horarios.entries())
          .map(([horas, dias]) => {
            const [horaDesde, horaHasta] = horas.split('\u0000');
            const diasTexto = [...dias]
              .sort((a, b) =>
                (ordenDias[a.toLocaleLowerCase('es')] ?? 7) -
                (ordenDias[b.toLocaleLowerCase('es')] ?? 7)
              )
              .map((dia) => dia.toLocaleLowerCase('es'))
              .join(', ');
            const horasTexto = horaDesde || horaHasta
              ? `${horaDesde}${horaDesde && horaHasta ? ' a ' : ''}${horaHasta}`
              : '';
            return [diasTexto, horasTexto].filter(Boolean).join(' ');
          })
          .filter(Boolean)
          .join('; ');
        return { tipo, detalles: `:${detalles ? ` ${detalles}` : ''}` };
      });
    const textoHorario = actividadesHorario.flatMap((actividad, index) => [
      ...(index > 0 ? [{ text: '\n' }] : []),
      {
        text: actividad.tipo,
        bold: /sincr[oó]nico|asincr[oó]nico/i.test(actividad.tipo)
      },
      { text: actividad.detalles }
    ]);

    const requerimientoNormalizado = String(formato.formato6_requerimiento || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const requerimientosSeleccionados = {
      planBianual: /plan\s*bi\s*anual/.test(requerimientoNormalizado),
      planCapacitacionContinua: /plan\s*b\s*(?:de\s*)?capacitacion\s*continua/.test(requerimientoNormalizado),
      capacitacionInterna: /capacitacion\s*interna/.test(requerimientoNormalizado),
      otros: /\botros?\b/.test(requerimientoNormalizado)
    };

    // =====================================================
    // 3. OBTENER NOMBRES DE LOS MÓDULOS
    // =====================================================

    const nombresModulos: {
      [key: string]: string
    } = {};


    horariosDebug.forEach(
      (
        horario: any,
        index: number
      ) => {

        let moduloId =
          horario.modulo_id;


        if (!moduloId) {

          const coincidencia =
            String(
              horario.modulo_nombre || ''
            ).match(/\d+/);


          if (coincidencia) {

            moduloId =
              Number(
                coincidencia[0]
              );

          } else {

            moduloId =
              index + 1;

          }

        }


        nombresModulos[
          String(moduloId)
        ] =
          horario.modulo_nombre ||
          `Módulo ${moduloId}`;

      }
    );


    // También obtenemos módulos desde contenidos

    contenidos.forEach(
      (item: any) => {

        const moduloId =
          item.modulo_id || 1;


        if (
          !nombresModulos[
            String(moduloId)
          ]
        ) {

          nombresModulos[
            String(moduloId)
          ] =
            `Módulo ${moduloId}`;

        }

      }
    );


    console.log(
      'NOMBRES DE MÓDULOS:',
      nombresModulos
    );


    // =====================================================
    // 4. PLANIFICACIÓN DE CONTENIDOS
    // =====================================================

    const contenidosPorModulo: {
      [key: string]: any[]
    } = {};


    const modulosFormato =
      Array.isArray(formato?.modulos)
        ? formato.modulos
        : [];

    let hayContenidosEnModulos = false;

    modulosFormato.forEach(
      (modulo: any, index: number) => {

        const moduloId =
          modulo.id || modulo.modulo_id || index + 1;

        const moduloClave =
          String(moduloId);

        const contenidosModulo =
          Array.isArray(modulo.contenidos)
            ? modulo.contenidos
            : [];

        const arbolContenidos = this.construirArbolContenidos(contenidosModulo);
        contenidosPorModulo[moduloClave] = arbolContenidos;

        nombresModulos[moduloClave] =
          modulo.modulo_nombre ||
          modulo.nombre ||
          nombresModulos[moduloClave] ||
          `Módulo ${moduloId}`;

        hayContenidosEnModulos =
          hayContenidosEnModulos || arbolContenidos.length > 0;

      }
    );


    if (!hayContenidosEnModulos) {

      const contenidosPorModuloPlano = new Map<string, any[]>();
      contenidos.forEach((item: any) => {
        const moduloId = item.modulo_id || 1;
        const moduloClave = String(moduloId);
        const nombreModulo = String(item.modulo_nombre || '').trim();
        if (
          nombreModulo &&
          (!nombresModulos[moduloClave] || /^Módulo\s+\d+$/i.test(nombresModulos[moduloClave]))
        ) {
          nombresModulos[moduloClave] = nombreModulo;
        }
        if (!contenidosPorModuloPlano.has(moduloClave)) {
          contenidosPorModuloPlano.set(moduloClave, []);
        }
        contenidosPorModuloPlano.get(moduloClave)?.push(item);
      });
      contenidosPorModuloPlano.forEach((filas, moduloClave) => {
        contenidosPorModulo[moduloClave] = this.construirArbolContenidos(filas);
      });

      hayContenidosEnModulos = contenidosPorModuloPlano.size > 0;

    }


    if (!hayContenidosEnModulos) {

      let planificacionGuardada =
        formato?.formato6_planificacion_contenidos;

      if (typeof planificacionGuardada === 'string') {

        try {
          planificacionGuardada = JSON.parse(planificacionGuardada);
        } catch {
          planificacionGuardada = [planificacionGuardada];
        }

      }

      if (!Array.isArray(planificacionGuardada)) {
        planificacionGuardada = [];
      }

      planificacionGuardada.forEach(
        (moduloTexto: any, index: number) => {

          const lineas =
            String(moduloTexto || '').split(/\r?\n/);

          const moduloId =
            String(index + 1);

          const nombreModulo =
            (lineas.shift() || '').trim();

          const contenidosModulo =
            lineas
              .map((linea: string) =>
                linea.replace(/^\s*[-•o]\s*/, '').trim()
              )
              .filter(Boolean);

          if (nombreModulo || contenidosModulo.length > 0) {

            contenidosPorModulo[moduloId] =
              this.construirArbolContenidos(contenidosModulo);

            nombresModulos[moduloId] =
              nombreModulo || `Módulo ${moduloId}`;

          }

        }
      );

    }


    const layoutTablaCuadriculada = {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#666666',
      vLineColor: () => '#666666',
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 4,
      paddingBottom: () => 4
    };


    const planificacionContenidoPdf: any[] = [];

    Object.keys(contenidosPorModulo)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((moduloId: string) => {

        const lista = contenidosPorModulo[moduloId];
        const nombreModulo =
          nombresModulos[moduloId] || `Módulo ${moduloId}`;
        const tituloModulo =
          new RegExp(`^Módulo\\s+${moduloId}$`, 'i').test(nombreModulo)
            ? nombreModulo
            : `Módulo ${moduloId}: ${nombreModulo}`;

        planificacionContenidoPdf.push({
          text: tituloModulo,
          bold: true,
          fontSize: 11,
          color: '#ab171f',
          margin: [0, 8, 0, 3]
        });

        const agregarNodosPdf = (nodos: any[], nivel: number): void => {
          nodos.forEach((nodo) => {
            if (nodo.texto) {
              planificacionContenidoPdf.push({
                text: `${nivel === 0 ? '•' : '○'} ${nodo.texto}`,
                fontSize: 10,
                lineHeight: 1.3,
                margin: [12 + nivel * 14, 0, 0, 3]
              });
            }
            agregarNodosPdf(nodo.hijos || [], nivel + 1);
          });
        };
        agregarNodosPdf(lista, 0);

      });


    // =====================================================
    // 5. CRONOGRAMA DEL EVENTO
    // =====================================================

    const cronogramaPorModulo: {
      [key: string]: {
        nombre: string;
        horarios: string[];
        fechas: { [fecha: string]: { texto: string; horas: number } };
        horasTotales: number;
      }
    } = {};
    const normalizarNombreModulo = (nombre: string): string =>
      nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();


    // =====================================================
    // RECORRER HORARIOS
    // =====================================================

    horariosDebug.forEach(
      (horario: any) => {

        const diasHorarios =
          obtenerDiasHorarios(
            horario
          );


        if (
          !horario.modulo_desde ||
          !horario.modulo_hasta
        ) {

          return;

        }


        // -------------------------------------------------
        // OBTENER ID DEL MÓDULO
        // -------------------------------------------------

        const nombreHorario = String(horario.modulo_nombre || '').trim();
        const nombreGenerico = nombreHorario.match(/^m[oó]dulo\s*(\d+)$/i);
        const moduloPorNombre = nombreHorario
          ? modulosFormato.find((modulo: any) =>
              normalizarNombreModulo(String(modulo?.modulo_nombre || modulo?.nombre || '')) ===
              normalizarNombreModulo(nombreHorario)
            )
          : undefined;
        const moduloId =
          horario.modulo_id ||
          nombreGenerico?.[1] ||
          moduloPorNombre?.modulo_id ||
          moduloPorNombre?.id;
        const nombreEsGenerico = /^m[oó]dulo$/i.test(nombreHorario);
        const moduloClave = moduloId
          ? String(moduloId)
          : nombreHorario && !nombreEsGenerico
            ? `nombre:${normalizarNombreModulo(nombreHorario)}`
            : `periodo:${horario.modulo_desde}|${horario.modulo_hasta}`;


        // -------------------------------------------------
        // CREAR MÓDULO
        // -------------------------------------------------

        if (
          !cronogramaPorModulo[
            moduloClave
          ]
        ) {

          cronogramaPorModulo[
            moduloClave
          ] = {

            nombre:
              nombreHorario ||
              nombresModulos[
                moduloClave
              ] ||
              `Módulo ${Object.keys(cronogramaPorModulo).length + 1}`,

            horarios: [],

            fechas: {},

            horasTotales: 0

          };

        }


        // -------------------------------------------------
        // HORARIO DEL MÓDULO
        // -------------------------------------------------

        let textoHorarioModulo =
          horario.tipo_actividad ||
          '';


        diasHorarios.forEach(
          (diaHorario: any) => {

            textoHorarioModulo +=
              `\n${diaHorario.dia || ''}: ` +
              `${diaHorario.horaDesde || ''} - ` +
              `${diaHorario.horaHasta || ''}`;

          }
        );


        cronogramaPorModulo[
          moduloClave
        ].horarios.push(
          textoHorarioModulo
        );


        // -------------------------------------------------
        // RECORRER FECHAS
        // -------------------------------------------------

        const fechaInicio =
          new Date(
            horario.modulo_desde +
            'T00:00:00'
          );


        const fechaFin =
          new Date(
            horario.modulo_hasta +
            'T00:00:00'
          );


        let fechaActual =
          new Date(
            fechaInicio
          );


        while (
          fechaActual <= fechaFin
        ) {

          const nombreDia =
            obtenerNombreDia(
              fechaActual
            );


          // Buscar si este día
          // fue seleccionado

          const configuracionDia =
            diasHorarios.find(
              (dia: any) =>
                String(
                  dia.dia || ''
                )
                  .trim()
                  .toLowerCase() ===
                nombreDia
                  .trim()
                  .toLowerCase()
            );


          if (
            configuracionDia
          ) {

            // ---------------------------------------------
            // FECHA COMPLETA
            // ---------------------------------------------

            const fechaISO =
              fechaActual
                .toISOString()
                .substring(
                  0,
                  10
                );


            const fechaTexto =
              `${nombreDia} ` +
              `${formatearFecha(
                fechaISO
              )}`;

            // ---------------------------------------------
            // HORAS
            // ---------------------------------------------

            const horas =
              calcularHoras(
                configuracionDia.horaDesde,
                configuracionDia.horaHasta
              );

            const fechasModulo =
              cronogramaPorModulo[moduloClave].fechas;
            if (!fechasModulo[fechaISO]) {
              fechasModulo[fechaISO] = {
                texto: fechaTexto,
                horas: 0
              };
            }
            fechasModulo[fechaISO].horas += horas;

            cronogramaPorModulo[
              moduloClave
            ].horasTotales +=
              horas;

          }


          fechaActual.setDate(
            fechaActual.getDate() + 1
          );

        }

      }
    );


    console.log(
      'CRONOGRAMA POR MÓDULO:',
      cronogramaPorModulo
    );


    // =====================================================
    // TABLA DEL CRONOGRAMA
    // =====================================================

    const tablaCronograma: any[][] = [
      [
        { text: 'Horario', bold: true, alignment: 'center' },
        { text: 'Fechas', bold: true, alignment: 'center' },
        { text: 'Horas totales', bold: true, alignment: 'center' }
      ]
    ];

    Object.keys(cronogramaPorModulo)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((moduloId) => {
        const modulo = cronogramaPorModulo[moduloId];
        const textoHorarioModulo = modulo.horarios.join('\n\n');
        const textoFechas = Object.values(modulo.fechas)
          .map((fecha) => {
            const horas = Number(fecha.horas.toFixed(2));
            const horasTexto = Number.isInteger(horas)
              ? String(horas)
              : String(horas).replace('.', ',');
            return `${fecha.texto} (${horasTexto}h)`;
          })
          .join('\n');
        const textoHoras =
          `${modulo.horasTotales} horas / ` +
          `${formato.formato6_carga_horaria || 0} horas`;
        const nombreModulo = String(modulo.nombre || '').trim();
        const tituloModulo = new RegExp(`^Módulo\\s+${moduloId}(?:\\s*:|$)`, 'i')
          .test(nombreModulo)
          ? nombreModulo
          : `Módulo ${moduloId}: ${nombreModulo}`;

        tablaCronograma.push([
          {
            text: [
              { text: `${tituloModulo}\n`, bold: true },
              { text: textoHorarioModulo }
            ],
            fontSize: 8,
            alignment: 'left'
          },
          { text: textoFechas, fontSize: 8 },
          { text: textoHoras, fontSize: 8, bold: true }
        ]);
      });


    // =====================================================
    // 6. TABLA DE PRESUPUESTO
    // =====================================================

    const tablaPresupuesto: any[] = [

      [

        {
          text:
            'Partida',

          bold:
            true,

          alignment:
            'center'
        },


        {
          text:
            'Descripción',

          bold:
            true,

          alignment:
            'center'
        },


        {
          text:
            'Valor',

          bold:
            true,

          alignment:
            'center'
        },


        {
          text:
            'Total',

          bold:
            true,

          alignment:
            'center'
        }

      ]

    ];


    presupuesto.forEach(
      (item: any, index: number) => {

        const descripcion =
          item.descripcion ||
          (index === 0 && formato?.formato6_carga_horaria
            ? `Instructores × ${formato.formato6_carga_horaria} horas`
            : '');

        const valorParaReporte =
          String(item.valor ?? '');

        tablaPresupuesto.push([

          {
            text: item.partida || '',
            alignment: 'left'
          },


          {
            text: descripcion,
            alignment: 'left'
          },


          {
            text: valorParaReporte,
            alignment: 'left'
          },


          {
            text: String(
                item.total ?? 0
              ),
            alignment: 'left'
          }

        ]);

      }
    );

    const totalPresupuesto = presupuesto.reduce(
      (acumulado: number, item: any) =>
        acumulado +
        (Number(
          String(item?.total ?? 0).replace(',', '.')
        ) || 0),
      0
    );

    tablaPresupuesto.push([
      {
        text: 'TOTAL EGRESOS',
        colSpan: 3,
        bold: true,
        alignment: 'right'
      },
      {},
      {},
      {
        text: totalPresupuesto.toFixed(2),
        bold: true,
        alignment: 'left'
      }
    ]);


    // =====================================================
    // 7. DOCUMENTO PDF
    // =====================================================

    const documentDefinition: any = {

      pageSize:
        'A4',


      pageMargins: [
        40,
        80,
        40,
        80
      ],


      // ===================================================
      // ENCABEZADO
      // ===================================================

      header: {

        image:
          encabezado,

        width:
          515,

        alignment:
          'center',

        margin: [
          0,
          15,
          0,
          0
        ]

      },


      // ===================================================
      // PIE DE PÁGINA
      // ===================================================

      footer: {

        image:
          pie,

        width:
          515,

        alignment:
          'center',

        margin: [
          0,
          0,
          0,
          15
        ]

      },


      // ===================================================
      // CONTENIDO
      // ===================================================

      content: [


        // =================================================
        // 1. DATOS INFORMATIVOS
        // =================================================

        tituloSeccion('1. DATOS INFORMATIVOS'),


        {

          table: {

            widths: [
              '35%',
              '32.5%',
              '32.5%'
            ],


            body: [

              [

                {
                  text:
                    'Fecha de elaboración',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_fecha_elaboracion
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Requerimiento',

                  bold:
                    true,
                  rowSpan: 3
                },

                {
                  text: 'Nro: CAU-P-613-2024',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],

              [
                {},
                {
                  columns: [
                    { text: 'Plan bi anual de educación', width: '*' },
                    {
                      text: requerimientosSeleccionados.planBianual ? 'X' : '',
                      width: 12,
                      alignment: 'right'
                    }
                  ]
                },
                {
                  columns: [
                    { text: 'Plan B de capacitación continua', width: '*' },
                    {
                      text: requerimientosSeleccionados.planCapacitacionContinua ? 'X' : '',
                      width: 12,
                      alignment: 'right'
                    }
                  ]
                }
              ],

              [
                {},
                {
                  columns: [
                    { text: 'Capacitación interna', width: '*' },
                    {
                      text: requerimientosSeleccionados.capacitacionInterna ? 'X' : '',
                      width: 12,
                      alignment: 'right'
                    }
                  ]
                },
                {
                  columns: [
                    { text: 'Otros', width: '*' },
                    {
                      text: requerimientosSeleccionados.otros ? 'X' : '',
                      width: 12,
                      alignment: 'right'
                    }
                  ]
                }
              ],

              [
                {
                  text: 'Unidad responsable',
                  bold: true
                },
                {
                  text: formato.formato6_unidad_responsable || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}
              ],

              [
                {
                  text: 'Instructores',
                  bold: true
                },
                {
                  text: formato.formato6_instructores || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}
              ],


              [

                {
                  text:
                    'Beneficiarios',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_beneficiarios
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Paralelo',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_paralelo
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Modalidad',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_modalidad
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Área',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_area
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Carga horaria',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_carga_horaria
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              // =========================================
              // PERÍODOS
              // =========================================

              [

                {
                  text:
                    'Períodos',

                  bold:
                    true
                },

                {
                  text:
                    textoPeriodos,

                  colSpan: 2,
                  alignment:
                    'left'

                },
                {}

              ],


              // =========================================
              // HORARIO
              // =========================================

              [

                {
                  text:
                    'Horario',

                  bold:
                    true
                },

                {
                  text:
                    textoHorario || '',

                  colSpan: 2,
                  alignment:
                    'left'

                },
                {}

              ],


              [

                {
                  text:
                    'Lugar',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_lugar
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Prerrequisitos',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_prerrequisitos
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Tipo de certificado',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_tipo_certificado
                    || '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ],


              [

                {
                  text:
                    'Inversión',

                  bold:
                    true
                },

                {
                  text: formato.formato6_inversion !== null &&
                    formato.formato6_inversion !== undefined &&
                    formato.formato6_inversion !== ''
                      ? `${formato.formato6_inversion} $`
                      : '',
                  colSpan: 2,
                  alignment: 'left'
                },
                {}

              ]

            ]

          },

          layout:
            layoutTablaCuadriculada

        },


        // =================================================
        // 2. INTRODUCCIÓN
        // =================================================

        {

          text: '',

          pageBreak:
            'before'

        },


        tituloSeccion(
          '2. INTRODUCCIÓN'
        ),


        {

          text:
            formato.formato6_introduccion
            || '',

          alignment:
            'justify',

          fontSize:
            10,

          lineHeight:
            1.3,

          margin: [
            0,
            0,
            0,
            15
          ]

        },


        // =================================================
        // 3. JUSTIFICACIÓN
        // =================================================

        tituloSeccion(
          '3. JUSTIFICACIÓN'
        ),


        {

          text:
            formato.formato6_justificacion
            || '',

          alignment:
            'justify',

          fontSize:
            10,

          lineHeight:
            1.3

        },


        // =================================================
        // 4. OBJETIVOS
        // =================================================

        {

          text: '',

          pageBreak:
            'before'

        },


        tituloSeccion(
          '4. OBJETIVOS'
        ),


        {

          text:
            'A. Objetivo general',

          bold:
            true,

          fontSize:
            11,

          margin: [
            18,
            0,
            0,
            5
          ]

        },


        {

          text:
            formato.formato6_objetivo_general
            || '',

          alignment:
            'justify',

          fontSize:
            10,

          margin: [
            36,
            0,
            0,
            10
          ]

        },


        {

          text:
            'B. Objetivos específicos',

          bold:
            true,

          fontSize:
            11,

          margin: [
            18,
            0,
            0,
            5
          ]

        },


        {

          stack:
            objetivosEspecificosTexto,

          fontSize:
            10,

          margin: [
            18,
            0,
            0,
            15
          ]

        },


        // =================================================
        // 5. METODOLOGÍA
        // =================================================

        tituloSeccion(
          '5. METODOLOGÍA DEL CURSO'
        ),

        {

          text: [
            {
              text: 'Curso: ',
              bold: true
            },
            {
              text: formato.formato1_curso_definido || ''
            }
          ],

          fontSize: 11,

          margin: [0, 0, 0, 8]

        },


        {

          text:
            formato.formato6_metodologia
            || '',

          alignment:
            'justify',

          fontSize:
            10,

          lineHeight:
            1.3,

          margin: [
            0,
            0,
            0,
            15
          ]

        },


        // =================================================
        // 6. PLANIFICACIÓN
        // =================================================

        tituloSeccion(
          '6. PLANIFICACIÓN DE CONTENIDOS'
        ),


        {

          stack:
            planificacionContenidoPdf

        },


        // =================================================
        // 7. EVALUACIÓN
        // =================================================

        {

          text: '',

          pageBreak:
            'before'

        },


        tituloSeccion(
          '7. EVALUACIÓN'
        ),


        {

          text:
            formato.formato6_evaluacion
            || '',

          alignment:
            'justify',

          fontSize:
            10,

          lineHeight:
            1.3,

          margin: [
            0,
            0,
            0,
            15
          ]

        },


        // =================================================
        // 8. ACREDITACIÓN
        // =================================================

        tituloSeccion(
          '8. ACREDITACIÓN Y CALIFICACIÓN'
        ),


        {

          text:
            acreditacionConModalidad,

          alignment:
            'justify',

          fontSize:
            10,

          lineHeight:
            1.3,

          margin: [
            0,
            0,
            0,
            15
          ]

        },


        // =================================================
        // 9. CRONOGRAMA DEL EVENTO
        // =================================================

        tituloSeccion(
          '9. CRONOGRAMA DEL EVENTO'
        ),


        {
          table: {
            headerRows: 1,
            widths: ['45%', '40%', '15%'],
            body: tablaCronograma
          },
          layout: layoutTablaCuadriculada,
          fontSize: 8
        },


        // =================================================
        // 10. PRESUPUESTO
        // =================================================

        {

          text: '',

          pageBreak:
            'before'

        },


        tituloSeccion(
          '10. PRESUPUESTO'
        ),


        {

          table: {

            headerRows:
              1,

            widths: [
              '15%',
              '45%',
              '20%',
              '20%'
            ],

            body:
              tablaPresupuesto

          },

          layout:
            layoutTablaCuadriculada,

          fontSize:
            9

        },

        {
          text: 'NOTA: El valor hora de los Instructor/es de 20,00 USD.',
          fontSize: 9,
          margin: [0, 8, 0, 0]

        }

      ]

    };


    // =====================================================
    // GENERAR PDF
    // =====================================================

    console.log(
      'DOCUMENTO FINAL:',
      documentDefinition
    );


    pdfMake
      .createPdf(
        documentDefinition
      )
      .open();


  } catch (error) {

    console.error(
      'ERROR AL GENERAR PDF:',
      error
    );

    Swal.fire(
      'Error',
      'No se pudo generar el PDF. Revisa la consola.',
      'error'
    );

  }

}

}