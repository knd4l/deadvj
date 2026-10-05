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
            'No se encontraron los datos del Formato 6',
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

    const tituloSeccion = (
      texto: string
    ) => {

      return {
        text: texto,
        bold: true,
        fontSize: 12,
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
      .map((modulo) =>
        `${modulo.nombre}: ${formatearFecha(modulo.desde)} al ${formatearFecha(modulo.hasta)}`
      );

    const textoPeriodos =
      [
        'Inscripciones y matrícula:',
        `${formatearFecha(inscripcionDesde)} al ${formatearFecha(inscripcionHasta)}`,
        'Ejecución del curso:',
        `${formatearFecha(ejecucionDesde)} al ${formatearFecha(ejecucionHasta)}`,
        ...periodosModulos
      ].join('\n');

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

    const horariosPorModulo = new Map<string, { nombre: string; actividades: string[] }>();

    horariosDebug.forEach((horario: any, index: number) => {
      if (!horario.tipo_actividad) {
        return;
      }

      const nombreOriginal = String(horario.modulo_nombre || '').trim();
      const moduloId = horario.modulo_id ||
        nombreOriginal.match(/\d+/)?.[0] ||
        index + 1;
      const nombreModulo = nombreOriginal || `Módulo ${moduloId}`;
      const claveModulo = String(horario.modulo_id || nombreOriginal || moduloId).toLowerCase();
      let modulo = horariosPorModulo.get(claveModulo);

      if (!modulo) {
        modulo = { nombre: nombreModulo, actividades: [] };
        horariosPorModulo.set(claveModulo, modulo);
      }

      const lineasActividad = [String(horario.tipo_actividad)];
      obtenerDiasHorarios(horario).forEach((diaHorario: any) => {
        lineasActividad.push(
          `${diaHorario.dia || ''}: ${diaHorario.horaDesde || ''} - ${diaHorario.horaHasta || ''}`
        );
      });
      modulo.actividades.push(lineasActividad.join('\n'));
    });

    const textoHorario = Array.from(horariosPorModulo.values())
      .map((modulo) => `${modulo.nombre}:\n${modulo.actividades.join('\n\n')}`)
      .join('\n\n');


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

        contenidosPorModulo[moduloClave] =
          contenidosModulo;

        nombresModulos[moduloClave] =
          modulo.nombre ||
          nombresModulos[moduloClave] ||
          `Módulo ${moduloId}`;

        hayContenidosEnModulos =
          hayContenidosEnModulos || contenidosModulo.length > 0;

      }
    );


    if (!hayContenidosEnModulos) {

      contenidos.forEach(
        (item: any) => {

          const moduloId =
            item.modulo_id || 1;

          const moduloClave =
            String(moduloId);

          if (!contenidosPorModulo[moduloClave]) {

            contenidosPorModulo[moduloClave] = [];

          }

          contenidosPorModulo[moduloClave].push(item);

        }
      );

      hayContenidosEnModulos = contenidos.length > 0;

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
                linea.replace(/^\s*-\s*/, '').trim()
              )
              .filter(Boolean);

          if (nombreModulo || contenidosModulo.length > 0) {

            contenidosPorModulo[moduloId] =
              contenidosModulo;

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

        const contenidoTexto = lista
          .map((item: any) =>
            typeof item === 'string'
              ? item
              : item?.contenido || ''
          )
          .map((contenido: string) => contenido.trim())
          .filter(Boolean)
          .join('\n');

        planificacionContenidoPdf.push({
          text: tituloModulo,
          bold: true,
          fontSize: 11,
          margin: [0, 8, 0, 3]
        });

        if (contenidoTexto) {
          planificacionContenidoPdf.push({
            text: contenidoTexto,
            fontSize: 10,
            lineHeight: 1.3,
            margin: [12, 0, 0, 8]
          });
        }

      });


    // =====================================================
    // 5. CRONOGRAMA DEL EVENTO
    // =====================================================

    const cronogramaPorModulo: {
      [key: string]: {
        nombre: string;
        horarios: string[];
        fechas: string[];
        horasTotales: number;
      }
    } = {};


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

        let moduloId =
          horario.modulo_id;


        if (!moduloId) {

          const coincidencia =
            String(
              horario.modulo_nombre || ''
            ).match(/\d+/);


          moduloId =
            coincidencia
              ? Number(
                  coincidencia[0]
                )
              : 1;

        }


        const moduloClave =
          String(moduloId);


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
              horario.modulo_nombre ||
              nombresModulos[
                moduloClave
              ] ||
              `Módulo ${moduloClave}`,

            horarios: [],

            fechas: [],

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


            // Evitar duplicados

            if (
              !cronogramaPorModulo[
                moduloClave
              ].fechas.includes(
                fechaTexto
              )
            ) {

              cronogramaPorModulo[
                moduloClave
              ].fechas.push(
                fechaTexto
              );

            }


            // ---------------------------------------------
            // HORAS
            // ---------------------------------------------

            const horas =
              calcularHoras(
                configuracionDia.horaDesde,
                configuracionDia.horaHasta
              );


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

    const tablaCronograma: any[] = [

      [

        {
          text:
            'Horario',

          bold:
            true,

          alignment:
            'center'
        },


        {
          text:
            'Fechas',

          bold:
            true,

          alignment:
            'center'
        },


        {
          text:
            'Horas totales',

          bold:
            true,

          alignment:
            'center'
        }

      ]

    ];


    // =====================================================
    // UNA FILA POR CADA MÓDULO
    // =====================================================

    Object.keys(
      cronogramaPorModulo
    ).forEach(
      (
        moduloId: string
      ) => {

        const modulo =
          cronogramaPorModulo[
            moduloId
          ];


        // -----------------------------------------------
        // HORARIO
        // -----------------------------------------------

        let textoHorarioModulo =
          modulo.nombre;


        textoHorarioModulo +=
          '\n';


        textoHorarioModulo +=
          modulo.horarios.join(
            '\n\n'
          );


        // -----------------------------------------------
        // FECHAS
        // -----------------------------------------------

        const textoFechas =
          modulo.fechas.join(
            '\n'
          );


        // -----------------------------------------------
        // HORAS TOTALES
        // -----------------------------------------------

        const textoHoras =
          `${modulo.horasTotales} horas / ` +
          `${formato.formato6_carga_horaria || 0} horas`;


        tablaCronograma.push([

          {
            text:
              textoHorarioModulo,

            fontSize:
              8
          },


          {
            text:
              textoFechas,

            fontSize:
              8
          },


          {
            text:
              textoHoras,

            fontSize:
              8,

            alignment:
              'center',

            bold:
              true
          }

        ]);

      }
    );


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
            alignment: 'center'
          },


          {
            text: descripcion,
            alignment: 'center'
          },


          {
            text: valorParaReporte,
            alignment: 'center'
          },


          {
            text: String(
                item.total ?? 0
              ),
            alignment: 'center'
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
        alignment: 'center'
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

        {

          text:
            '1. DATOS INFORMATIVOS',

          bold:
            true,

          fontSize:
            14,
            
          alignment:
            'left',

          margin: [
            0,
            15,
            0,
            15
          ]

        },


        {

          table: {

            widths: [
              '35%',
              '65%'
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
                  alignment: 'center'
                }

              ],


              [

                {
                  text:
                    'Resolución',

                  bold:
                    true
                },

                {
                  text:
                    'Nro: RESOLUCIÓN: CAU-P-613-2024',

                  alignment:
                    'center'
                }

              ],


              [

                {
                  text:
                    'Requerimiento',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_requerimiento
                    || '',
                  alignment: 'center'
                }

              ],


              [

                {
                  text:
                    'Unidad responsable',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_unidad_responsable
                    || '',
                  alignment: 'center'
                }

              ],


              [

                {
                  text:
                    'Instructores',

                  bold:
                    true
                },

                {
                  text:
                    formato.formato6_instructores
                    || '',
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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

                  fontSize:
                    9,

                  lineHeight:
                    1.3,

                  alignment:
                    'left'

                }

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

                  fontSize:
                    9,

                  lineHeight:
                    1.3,

                  alignment:
                    'left'

                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
                  alignment: 'center'
                }

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
            'Objetivo general',

          bold:
            true,

          fontSize:
            11,

          margin: [
            0,
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
            0,
            0,
            0,
            10
          ]

        },


        {

          text:
            'Objetivos específicos',

          bold:
            true,

          fontSize:
            11,

          margin: [
            0,
            0,
            0,
            5
          ]

        },


        {

          ol:
            objetivosEspecificos.map(
              (item: any) =>
                item.objetivo || ''
            ),

          fontSize:
            10,

          margin: [
            0,
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

            headerRows:
              1,

            widths: [
              '45%',
              '40%',
              '15%'
            ],

            body:
              tablaCronograma

          },

          layout:
            layoutTablaCuadriculada,

          fontSize:
            8

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