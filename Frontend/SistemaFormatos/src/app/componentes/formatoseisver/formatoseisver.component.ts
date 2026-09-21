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

async generarPDFFormato6(formato: any): Promise<void>{

  try{

  // =====================================================
  // CONFIGURACIÓN GENERAL
  // =====================================================

  const encabezado =
    await this.convertirImagenBase64(
    'assets/img/encabezado.jpg');

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
  // OBJETIVOS ESPECÍFICOS
  // =====================================================

  const objetivosEspecificos =
    formato.objetivos_especificos || [];


  // =====================================================
  // CONTENIDOS
  // =====================================================

  const contenidos =
    formato.contenidos || [];


  // =====================================================
  // CRONOGRAMA
  // =====================================================

  const cronograma =
    formato.cronograma || [];


  // =====================================================
  // PRESUPUESTO
  // =====================================================

  const presupuesto =
    formato.presupuesto || [];


  // =====================================================
  // PLANIFICACIÓN DE CONTENIDOS
  // =====================================================

  const contenidosPorModulo: {
    [key: string]: any[]
  } = {};


  contenidos.forEach((item: any) => {

    const moduloId =
      item.modulo_id || 1;

    if (!contenidosPorModulo[moduloId]) {

      contenidosPorModulo[moduloId] =
        [];
    }

    contenidosPorModulo[moduloId]
      .push(item);
  });


  // =====================================================
  // TABLA DE PLANIFICACIÓN
  // =====================================================

  const tablaPlanificacion: any[] = [

    [
      {
        text: 'Módulo',
        bold: true,
        alignment: 'center'
      },
      {
        text: 'Contenidos',
        bold: true,
        alignment: 'center'
      }
    ]
  ];


  Object.keys(
    contenidosPorModulo
  ).forEach((moduloId: string) => {

    const lista =
      contenidosPorModulo[moduloId];

    const contenidosTexto =
      lista
        .map(
          (item: any, index: number) =>
            `${index + 1}. ${item.contenido}`
        )
        .join('\n');

    tablaPlanificacion.push([

      {
        text:
          `Módulo ${moduloId}`,
        bold: true
      },

      {
        text:
          contenidosTexto
      }

    ]);
  });


  // =====================================================
  // TABLA DE CRONOGRAMA
  // =====================================================

  const tablaCronograma: any[] = [

    [
      {
        text: 'Módulo',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Actividad',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Fechas',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Horario',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Horas',
        bold: true,
        alignment: 'center'
      }
    ]
  ];


  cronograma.forEach((item: any) => {

    tablaCronograma.push([

      item.modulo || '',

      item.actividad || '',

      (
        item.desde || ''
      ) +
      (
        item.hasta
          ? ' al ' + item.hasta
          : ''
      ),

      item.horario || '',

      String(
        item.horas_totales || 0
      )

    ]);
  });


  // =====================================================
  // TABLA DE PRESUPUESTO
  // =====================================================

  const tablaPresupuesto: any[] = [

    [
      {
        text: 'Partida',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Descripción',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Valor',
        bold: true,
        alignment: 'center'
      },

      {
        text: 'Total',
        bold: true,
        alignment: 'center'
      }
    ]
  ];


  presupuesto.forEach((item: any) => {

    tablaPresupuesto.push([

      item.partida || '',

      item.descripcion || '',

      String(
        item.valor || 0
      ),

      String(
        item.total || 0
      )

    ]);
  });


  // =====================================================
  // DOCUMENTO PDF
  // =====================================================

  const documentDefinition: any = {

    pageSize: 'A4',

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

      image: encabezado,

      width: 515,

      alignment: 'center',

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

      image: pie,

      width: 515,

      alignment: 'center',

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
      // PÁGINA 1
      // DATOS INFORMATIVOS
      // =================================================

      {

        text:
          '1. DATOS INFORMATIVOS',

        bold: true,

        fontSize: 14,

        alignment: 'center',

        margin: [
          0,
          0,
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
                bold: true
              },

              {
                text:
                  formato.formato6_fecha_elaboracion
                  || ''
              }
            ],

            [
              {
                text:
                  'Requerimiento',
                bold: true
              },

              {
                text:
                  formato.formato6_requerimiento
                  || ''
              }
            ],

            [
              {
                text:
                  'Unidad responsable',
                bold: true
              },

              {
                text:
                  formato.formato6_unidad_responsable
                  || ''
              }
            ],

            [
              {
                text:
                  'Instructores',
                bold: true
              },

              {
                text:
                  formato.formato6_instructores
                  || ''
              }
            ],

            [
              {
                text:
                  'Beneficiarios',
                bold: true
              },

              {
                text:
                  formato.formato6_beneficiarios
                  || ''
              }
            ],

            [
              {
                text:
                  'Paralelo',
                bold: true
              },

              {
                text:
                  formato.formato6_paralelo
                  || ''
              }
            ],

            [
              {
                text:
                  'Modalidad',
                bold: true
              },

              {
                text:
                  formato.formato6_modalidad
                  || ''
              }
            ],

            [
              {
                text:
                  'Área',
                bold: true
              },

              {
                text:
                  formato.formato6_area
                  || ''
              }
            ],

            [
              {
                text:
                  'Carga horaria',
                bold: true
              },

              {
                text:
                  formato.formato6_carga_horaria
                  || ''
              }
            ],

            // =========================================
            // PERÍODOS
            // =========================================

            [
              {
                text:
                  'Períodos',
                bold: true
              },

              {
                text:
                  formato.periodos
                  || ''
              }
            ],

            // =========================================
            // HORARIO
            // =========================================

            [
              {
                text:
                  'Horario',
                bold: true
              },

              {
                text:
                  formato.horario
                  || ''
              }
            ],

            [
              {
                text:
                  'Lugar',
                bold: true
              },

              {
                text:
                  formato.formato6_lugar
                  || ''
              }
            ],

            [
              {
                text:
                  'Prerrequisitos',
                bold: true
              },

              {
                text:
                  formato.formato6_prerrequisitos
                  || ''
              }
            ],

            [
              {
                text:
                  'Tipo de certificado',
                bold: true
              },

              {
                text:
                  formato.formato6_tipo_certificado
                  || ''
              }
            ],

            [
              {
                text:
                  'Inversión',
                bold: true
              },

              {
                text:
                  formato.formato6_inversion
                  || ''
              }
            ]

          ]
        },

        layout: 'lightHorizontalLines'

      },


      // =================================================
      // PÁGINA 2
      // INTRODUCCIÓN Y JUSTIFICACIÓN
      // =================================================

      {
        text: '',
        pageBreak: 'before'
      },


      tituloSeccion(
        '2. INTRODUCCIÓN'
      ),


      {
        text:
          formato.formato6_introduccion
          || '',

        alignment: 'justify',

        fontSize: 10,

        lineHeight: 1.3,

        margin: [
          0,
          0,
          0,
          15
        ]
      },


      tituloSeccion(
        '3. JUSTIFICACIÓN'
      ),


      {
        text:
          formato.formato6_justificacion
          || '',

        alignment: 'justify',

        fontSize: 10,

        lineHeight: 1.3
      },


      // =================================================
      // PÁGINA 3
      // OBJETIVOS + METODOLOGÍA + CONTENIDOS
      // =================================================

      {
        text: '',
        pageBreak: 'before'
      },


      tituloSeccion(
        '4. OBJETIVOS'
      ),


      {
        text:
          'Objetivo general',

        bold: true,

        fontSize: 11,

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

        alignment: 'justify',

        fontSize: 10,

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

        bold: true,

        fontSize: 11,

        margin: [
          0,
          0,
          0,
          5
        ]
      },


      {
        ol:
          objetivosEspecificos
            .map(
              (item: any) =>
                item.objetivo || ''
            ),

        fontSize: 10,

        margin: [
          0,
          0,
          0,
          15
        ]
      },


      tituloSeccion(
        '5. METODOLOGÍA DEL CURSO'
      ),


      {
        text:
          formato.formato6_metodologia
          || '',

        alignment: 'justify',

        fontSize: 10,

        lineHeight: 1.3,

        margin: [
          0,
          0,
          0,
          15
        ]
      },


      tituloSeccion(
        '6. PLANIFICACIÓN DE CONTENIDOS'
      ),


      {
        table: {

          headerRows: 1,

          widths: [
            '25%',
            '75%'
          ],

          body:
            tablaPlanificacion
        },

        layout: 'lightHorizontalLines',

        fontSize: 9
      },


      // =================================================
      // PÁGINA 4
      // EVALUACIÓN + ACREDITACIÓN + CRONOGRAMA
      // =================================================

      {
        text: '',
        pageBreak: 'before'
      },


      tituloSeccion(
        '7. EVALUACIÓN'
      ),


      {
        text:
          formato.formato6_evaluacion
          || '',

        alignment: 'justify',

        fontSize: 10,

        lineHeight: 1.3,

        margin: [
          0,
          0,
          0,
          15
        ]
      },


      tituloSeccion(
        '8. ACREDITACIÓN Y CALIFICACIÓN'
      ),


      {
        text:
          formato.formato6_acreditacion
          || '',

        alignment: 'justify',

        fontSize: 10,

        lineHeight: 1.3,

        margin: [
          0,
          0,
          0,
          15
        ]
      },


      tituloSeccion(
        '9. CRONOGRAMA DEL EVENTO'
      ),


      {
        table: {

          headerRows: 1,

          widths: [
            '20%',
            '18%',
            '22%',
            '25%',
            '15%'
          ],

          body:
            tablaCronograma
        },

        layout: 'lightHorizontalLines',

        fontSize: 8
      },


      // =================================================
      // PÁGINA 5
      // PRESUPUESTO
      // =================================================

      {
        text: '',
        pageBreak: 'before'
      },


      tituloSeccion(
        '10. PRESUPUESTO'
      ),


      {
        table: {

          headerRows: 1,

          widths: [
            '15%',
            '45%',
            '20%',
            '20%'
          ],

          body:
            tablaPresupuesto
        },

        layout: 'lightHorizontalLines',

        fontSize: 9
      }

    ]

  };


  // =====================================================
  // GENERAR PDF
  // =====================================================
  console.log(
  'IMAGEN QUE RECIBE PDFMAKE:',
  documentDefinition.header.image
);

console.log(
  'PIE QUE RECIBE PDFMAKE:',
  documentDefinition.footer.image
);
  pdfMake
    .createPdf(documentDefinition)
    .open();

  }catch(error){

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