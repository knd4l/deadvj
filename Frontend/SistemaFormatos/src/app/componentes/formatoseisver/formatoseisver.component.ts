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

          console.log(
            'RESPUESTA FORMATOS 06:',
            res
          );

          if (
            res &&
            res.data &&
            res.data.success &&
            Array.isArray(res.data.item)
          ) {

            this.listaformatos6 =
              res.data.item;

            console.log(
              'FORMATOS 06 ENCONTRADOS:',
              this.listaformatos6.length
            );

            console.table(
              this.listaformatos6
            );

          } else {

            this.listaformatos6 = [];

            console.warn(
              'No existen registros de Formato 06'
            );

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

  this.modulosService
    .obtenerFormato6Reporte(data)
    .subscribe({
      next: (res: any) => {

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

generarPDFFormato6(formato: any): void {

  Promise.all([
    this.imagenBase64('assets/img/encabezado.jpg'),
    this.imagenBase64('assets/img/footer.jpeg')
  ])
  .then(([logoEncabezado, logoPiePagina]) => {

    const documentDefinition: any = {

      pageSize: 'A4',

      pageMargins: [40, 80, 40, 80],

      header: {
        image: 'logoEncabezado',
        width: 500,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },

      footer: function(currentPage: number, pageCount: number) {
        return {
          stack: [
            {
              image: 'logoPiePagina',
              width: 500,
              alignment: 'center',
              margin: [0, 40, 0, 5]
            }
          ]
        };
      },

      images: {
        logoEncabezado: logoEncabezado,
        logoPiePagina: logoPiePagina
      },

      content: [

        // =====================================================
        // TITULO
        // =====================================================

       {
  table: {
    widths: ['*'],
    body: [
      [
        {
          text: '1. DATOS INFORMATIVOS',
          alignment:'left',
          bold: true,
          fontSize: 14,
          margin: [0, 2, 0, 2],

        }
      ]
    ]
  },

  layout: {
    hLineWidth: function(i: number, node: any) {
      return 1.5;
    },

    vLineWidth: function(i: number, node: any) {
      return 1.5;
    },

    hLineColor: function(i: number, node: any) {
      return '#000000';
    },

    vLineColor: function(i: number, node: any) {
      return '#000000';
    },

    paddingLeft: function(i: number, node: any) {
      return 5;
    },

    paddingRight: function(i: number, node: any) {
      return 5;
    },

    paddingTop: function(i: number, node: any) {
      return 5;
    },

    paddingBottom: function(i: number, node: any) {
      return 5;
    }
  },

    canvas: [
    {
      type: 'rect',
      x: 0,
      y: 0,
      w: 515,
      h: 35,
      r: 8,
      lineWidth: 1.5
    }
  ],

  margin: [0, 5, 0, 15]
},

        // =====================================================
        // UNA SOLA TABLA CON TODO EL FORMATO 06
        // =====================================================

        {
          table: {

            widths: [170, '*'],

            body: [

              // INFORMACIÓN GENERAL

             [
              {
                text: 'Fecha de elaboración',
                bold: true
              },
              {
                columns: [
                  {
                    text: formato.formato6_fecha_elaboracion || '',
                    width: '*'
                  },
                  {
                    table: {
                      widths: [30], // 1.5 cm aproximadamente
                      body: [
                        [
                          {
                            text: 'NSIA',
                            color: 'white',
                            bold: true,
                            fontSize: 8,
                            alignment: 'center',
                            margin: [0, 0, 0, 0]
                          }
                        ]
                      ]
                    },
                    layout: {
                      fillColor: function(rowIndex: number, node: any) {
                        return '#008000'; // VERDE
                      },
                      hLineWidth: function(i: number, node: any) {
                        return 0;
                      },
                      vLineWidth: function(i: number, node: any) {
                        return 0;
                      }
                    },
                    width: 43
                  }
                ],
                columnGap: 5
              }
            ],

              [
                {
                  text: 'Requerimiento',
                  bold: true
                },
                {
                  text: formato.formato6_requerimiento || ''
                }
              ],

              [
                {
                  text: 'Unidad responsable',
                  bold: true
                },
                {
                  text: formato.formato6_unidad_responsable || ''
                }
              ],

              [
                {
                  text: 'Instructores',
                  bold: true
                },
                {
                  text: formato.formato6_instructores || ''
                }
              ],

              [
                {
                  text: 'Beneficiarios',
                  bold: true
                },
                {
                  text: formato.formato6_beneficiarios || ''
                }
              ],

              [
                {
                  text: 'Paralelo',
                  bold: true
                },
                {
                  text: formato.formato6_paralelo || ''
                }
              ],

              // DETALLE DE CAPACITACIÓN

              [
                {
                  text: 'Modalidad',
                  bold: true
                },
                {
                  text: formato.formato6_modalidad || ''
                }
              ],

              [
                {
                  text: 'Área',
                  bold: true
                },
                {
                  text: formato.formato6_area || ''
                }
              ],

              [
                {
                  text: 'Carga horaria',
                  bold: true
                },
                {
                  text: formato.formato6_carga_horaria || ''
                }
              ],

              [
                {
                  text: 'Períodos',
                  bold: true
                },
                {
                  text: formato.formato6_periodos || ''
                }
              ],

              [
                {
                  text: 'Horario',
                  bold: true
                },
                {
                  text: formato.formato6_horario || ''
                }
              ],

              [
                {
                  text: 'Lugar',
                  bold: true
                },
                {
                  text: formato.formato6_lugar || ''
                }
              ],

              // REQUISITOS Y CERTIFICACIÓN

              [
                {
                  text: 'Prerrequisitos',
                  bold: true
                },
                {
                  text: formato.formato6_prerrequisitos || ''
                }
              ],

              [
                {
                  text: 'Tipo de certificado',
                  bold: true
                },
                {
                  text: formato.formato6_tipo_certificado || ''
                }
              ],

              [
                {
                  text: 'Inversión',
                  bold: true
                },
                {
                  text: formato.formato6_inversion || ''
                }
              ]

            ]

          },

          layout: {

            hLineWidth: function(i: number, node: any) {
              return 0.8;
            },

            vLineWidth: function(i: number, node: any) {
              return 0.8;
            },

            paddingLeft: function(i: number, node: any) {
              return 6;
            },

            paddingRight: function(i: number, node: any) {
              return 6;
            },

            paddingTop: function(i: number, node: any) {
              return 6;
            },

            paddingBottom: function(i: number, node: any) {
              return 6;
            }

          },

          margin: [0, 0, 0, 15]
        },

      ]
    };

    // =====================================================
    // GENERAR PDF
    // =====================================================

    (pdfMake as any)
      .createPdf(documentDefinition)
      .open();

  })
  .catch((error) => {

    console.error('ERROR AL CARGAR IMÁGENES DEL PDF:', error);

    Swal.fire(
      'Error',
      'No se pudo generar el PDF del Formato 06',
      'error'
    );

  });
}

}