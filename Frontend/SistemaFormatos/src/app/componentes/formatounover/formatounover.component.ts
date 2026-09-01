import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../servicios/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModulosService } from '../../servicios/modulos.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-formatounover',
  templateUrl: './formatounover.component.html',
  styleUrls: ['./formatounover.component.css']
})
export class FormatounoverComponent implements OnInit {

  listaformatos1: any[] = [];
  tiposNecesidad: any[] = [];
  usuario: any = [];
  usersAux: any = [];
  tematicasSeleccionadas: any[] = []; //Para almacenar las temáticas seleccionadas
  tematicaSeleccionada: string = '';// Temática que el usuario seleccionó de la lista.
  tematicaNuevaEditada: string = '';// Temática que el usuario puede modificar en el input.
  formatoIdSeleccionado: number;// Código del formato que estamos editando.
  cursoDefinidoGuardado: boolean = false;// Indica si el curso ya fue guardado correctamente.


  index: number = 1;
  pages: number = 1;

  public browserRefresh: boolean = false;

  constructor(
    private userService: UsersService,
    private router: Router,
    private modulosService: ModulosService
  ) {}

  ngOnInit(): void {
    this.cargarListaFormatos1();
    this.cargarTiposNecesidad();
  }

  // ==========================================
  // VER REPORTE
  // ==========================================
  verReporteFormato1(idformato1: any): void {

    console.log('ID FORMATO 01:', idformato1);

    alert(idformato1);
  }

  private normalizarTexto(valor: any): string {
    if (valor === null || valor === undefined || valor === '') {
      return '';
    }

    if (Array.isArray(valor)) {
      return valor
        .map((item: any) => this.normalizarTexto(item))
        .filter((item: string) => item !== '')
        .join(', ');
    }

    if (typeof valor === 'object') {
      const candidatos = [
        valor.nombre,
        valor.descripcion,
        valor.texto,
        valor.valor,
        valor.email,
        valor.correo,
        valor.nombre_archivo,
        valor.archivo,
        valor.titulo
      ];

      const texto = candidatos.find((item: any) => item !== null && item !== undefined && item !== '');
      return texto !== undefined ? String(texto) : '';
    }

    return String(valor);
  }

  private findInObject(formato: any, aliases: string[]): any {
    if (!formato || typeof formato !== 'object') {
      return undefined;
    }

    const keys = Object.keys(formato);

    for (const alias of aliases) {
      const exact = formato[alias];
      if (exact !== undefined && exact !== null && exact !== '') {
        return exact;
      }

      const match = keys.find((key) => key.toLowerCase() === alias.toLowerCase());
      if (match && formato[match] !== undefined && formato[match] !== null && formato[match] !== '') {
        return formato[match];
      }

      const partial = keys.find((key) => key.toLowerCase().includes(alias.toLowerCase()));
      if (partial && formato[partial] !== undefined && formato[partial] !== null && formato[partial] !== '') {
        return formato[partial];
      }
    }

    return undefined;
  }

  private getValue(formato: any, keys: string[], fallback: any = ''): any {
    for (const key of keys) {
      const value = this.findInObject(formato, [key]);
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return fallback;
  }

  private getTextValue(formato: any, keys: string[]): string {
    const value = this.getValue(formato, keys, '');
    return this.normalizarTexto(value);
  }

  private getConsecuencias(formato: any): string[] {
    const desdeString = this.normalizarTexto(this.getValue(formato, ['consecuencias', 'consecuencia', 'consecuencia_descripcion']));
    const desdeArray = Array.isArray(formato?.consecuencias)
      ? formato.consecuencias
      : [];

    const normalizadas = desdeArray.map((item: any) => this.normalizarTexto(item?.descripcion ?? item?.nombre ?? item));

    const stringParts = desdeString
      ? desdeString.split(',').map((item: string) => item.trim()).filter((item: string) => item !== '')
      : [];

    const valores = [
      this.getValue(formato, ['formato1_consecuencia1', 'consecuencia1', 'consecuencia_1', 'consecuencia1_descripcion']),
      this.getValue(formato, ['formato1_consecuencia2', 'consecuencia2', 'consecuencia_2', 'consecuencia2_descripcion']),
      this.getValue(formato, ['formato1_consecuencia3', 'consecuencia3', 'consecuencia_3', 'consecuencia3_descripcion'])
    ].map((valor) => this.normalizarTexto(valor));

    const resultado = [...normalizadas, ...stringParts];
    valores.forEach((valor) => {
      if (valor && resultado.length < 3) {
        resultado.push(valor);
      }
    });

    while (resultado.length < 3) {
      resultado.push('');
    }

    return resultado.slice(0, 3);
  }

  private getDocumentos(formato: any): { actaDescripcion: string; acuerdo: string; acuerdoRuta: string; criterio: string; criterioRuta: string } {
    const actaDescripcion = this.getTextValue(formato, ['anexo_acta_trabajo_descripcion', 'formato1_acta_trabajo', 'acta_trabajo_descripcion', 'actaTrabajoTexto']);
    const acuerdo = this.getValue(formato, ['anexo_acuerdo_calidad', 'formato1_acuerdo_calidad', 'acuerdo_calidad', 'acuerdoCalidad', 'acuerdo_de_calidad', 'acuerdo'], false);
    const criterio = this.getValue(formato, ['anexo_criterio_aceptacion', 'formato1_criterio_calidad', 'criterio_evaluacion', 'criterioCalificacion', 'criterio_de_calificacion', 'criterio'], false);

    return {
      actaDescripcion: actaDescripcion.toLowerCase() === 'no' ? '' : actaDescripcion,
      acuerdo: this.normalizarTexto(acuerdo),
      acuerdoRuta: this.getTextValue(formato, ['anexo_acuerdo_calidad_ruta']),
      criterio: this.normalizarTexto(criterio),
      criterioRuta: this.getTextValue(formato, ['anexo_criterio_aceptacion_ruta'])
    };
  }

  private textoTiposNecesidad(formato: any): string {
    const codigoSeleccionado = String(this.getValue(formato, [
      'formato1_tipo_capacitacion',
      'tipo_capac_codigo',
      'tipo_necesidad'
    ], ''));
    
    const nombreSeleccionado = this.getTextValue(formato, [
      'tipo_capac_nombre',
      'tipo_necesidad_nombre'
    ]);

    const tipos = this.tiposNecesidad.length
      ? this.tiposNecesidad
      : (nombreSeleccionado ? [{ tipo_capac_codigo: codigoSeleccionado, tipo_capac_nombre: nombreSeleccionado }] : []);

    const opciones = tipos
      .map((tipo: any) => {
        const codigo = String(tipo.tipo_capac_codigo ?? '');
        const nombre = this.normalizarTexto(tipo.tipo_capac_nombre);
        const seleccionado = codigo === codigoSeleccionado || nombre === nombreSeleccionado;
        return `${seleccionado ? '[X]' : '[ ]'} ${nombre}`;
      });

    return opciones.length ? opciones.join('\n') : 'No registrado';
  }

  private nombreArchivo(ruta: string): string {
    if (!ruta || ruta.toLowerCase() === 'no') {
      return 'No adjuntado';
    }
    return ruta.split('/').pop() || ruta;
  }

  private estadoDocumento(valor: string): string {
    const existe = !!valor && valor.trim() !== '' && valor.toLowerCase() !== 'no';
    return existe ? '[X] Sí    [ ] No' : '[ ] Sí    [X] No';
  }

  private urlArchivo(ruta: string): string | undefined {
    if (!ruta || ruta.toLowerCase() === 'no') {
      return undefined;
    }
    return ruta.startsWith('http') ? ruta : `http://localhost${ruta}`;
  }

  idrequerimiento: any;
  /*abrirModalResponsable(fnumero: any): void {

    this.idrequerimiento = fnumero;

    console.log('id:', this.idrequerimiento);

  }*/

    //Se convierte el string a arreglo 
 abrirModalResponsable(tematicas: string, idFormato: number) {

  console.log('ID DEL FORMATO:', idFormato);
  console.log('TEMATICAS RECIBIDAS:', tematicas);

  this.formatoIdSeleccionado = idFormato;

  // Convertimos el texto recibido desde la base de datos
  // en un arreglo de temáticas.
  this.tematicasSeleccionadas = tematicas
    ? tematicas.split(',').map(t => t.trim())
    : [];

  this.tematicaSeleccionada = '';
  this.tematicaNuevaEditada = '';
  this.cursoDefinidoGuardado = false;
}

  //Gaurda la tematica final nombre del curso

guardarTematicaFinal() {

  // Verificamos que exista un formato seleccionado.
  if (!this.formatoIdSeleccionado) {

    console.error('No se ha seleccionado un formato.');

    return;
  }

  // Verificamos que el usuario haya escrito algo.
  if (!this.tematicaNuevaEditada ||
      !this.tematicaNuevaEditada.trim()) {

    console.error('Debe ingresar una temática.');

    return;
  }

  // Guardamos la temática editada.
  const cursoNombre = this.tematicaNuevaEditada.trim();

  console.log(
    'Guardando curso:',
    cursoNombre
  );

  console.log(
    'ID DEL FORMATO:',
    this.formatoIdSeleccionado
  );

  this.guardarCursoDefinido(
    cursoNombre,
    this.formatoIdSeleccionado
  ).subscribe({

    next: (respuesta: any) => {

      console.log(
        'Respuesta del servidor:',
        respuesta
      );

      // Verificamos si PHP confirmó el guardado.
      if (respuesta?.data?.success) {

        console.log(
          'Curso definido guardado correctamente'
        );

        // Ocultamos el input y el botón.
        this.cursoDefinidoGuardado = true;

      } else {

        console.error(
          'No se pudo guardar:',
          respuesta?.data?.message
        );

      }

    },

    error: (error: any) => {

      console.error(
        'Error al guardar:',
        error
      );

    }

  });
}


  seleccionarTematica(tematica: string) {

  // Guardamos la temática seleccionada.
  this.tematicaSeleccionada = tematica;

  // Colocamos la temática seleccionada dentro del input
  // para que el usuario pueda modificarla.
  this.tematicaNuevaEditada = tematica;

  // Al seleccionar una temática todavía no significa
  // que haya sido guardada.
  this.cursoDefinidoGuardado = false;

  console.log('TEMÁTICA SELECCIONADA:', tematica);
}

guardarCursoDefinido(cursoNombre: string, codigoF1: number) {

  // Datos que serán enviados al backend.
  const data = {

    // Indica qué operación debe ejecutar PHP.
    fx: 'insertCursoDefinido',

    // Datos específicos del curso.
    d: {
      formato1_id: codigoF1,
      tematica: cursoNombre
    },

    // Datos adicionales utilizados por el sistema.
    dpro: 0,
    dus: 0,
    dcx: 1
  };

  // Mostramos los datos antes de enviarlos.
  console.log('Datos a guardar:', data);

  // Enviamos la información al backend.
  return this.modulosService
    .insertarCursoDefinido(data)
    .pipe(

      catchError((err: any) => {

        console.error(
          'Error al guardar curso definido:',
          err
        );

        return of(null);

      })

    );
}


  // ==========================================
// VALIDAR TEMÁTICAS
// ==========================================
validarTematicas(formato: any): void {

  console.log('FORMATO A VALIDAR:', formato);
  console.log('TEMÁTICAS:', formato.formato1_tematicas);

}


  // ==========================================
  // GENERAR / VER PDF
  // ==========================================
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

  async verFormularioPDF(idformato1: any): Promise<void> {

  console.log('ID RECIBIDO:', idformato1);

  const formato = this.listaformatos1.find(
    (f: any) => String(f.id) === String(idformato1)
  );

  /*console.log('FORMATO ENCONTRADO:', formato);

console.log('================================');
console.log('PRUEBA TEMÁTICAS PDF');
console.log('FORMATO COMPLETO:', formato);
console.log('CAMPOS DISPONIBLES:', Object.keys(formato));
console.log('formato1_tematicas:', formato.formato1_tematicas);
console.log('tematicas_tentativas:', formato.tematicas_tentativas);
console.log('================================');*/

  if (!formato) {

    Swal.fire(
      'Error',
      'No se encontró el registro del Formato 01',
      'error'
    );

    return;
  }

  const correo = this.getTextValue(formato, ['formato1_correo', 'correo', 'email', 'correo_electronico', 'e_mail']);
  const fechaElaboracion = this.getTextValue(formato, [
    'formato1_fecha_elaboracion',
    'fecha_elaboracion',
    'fecha_de_elaboracion',
    'fecha_creacion',
    'formato1_fecha_ejecucion',
    'fecha_ejecucion'
  ]);

  const tematicas = this.getTextValue(formato, [
    'tematicas_tentativas',
    'tematicas_tentativas_txt',
    'formato1_tematicas',
    'tematicas',
    'tema_tentativo'
  ]);

  const mesEjecucion = this.getTextValue(formato, [
    'formato1_mes_ejecucion',
    'mes_ejecucion',
    'mesdeejecucion',
    'mes_ejecucion_nombre',
    'mesejecucion'
  ]);

  const numeroPersonas = this.getTextValue(formato, [
    'formato1_numero_personas',
    'numero_personas',
    'numeropersonas',
    'cantidad_personas'
  ]);

  const cargaHoraria = this.getTextValue(formato, [
    'formato1_carga_horaria',
    'carga_horaria',
    'cargahoraria',
    'horas'
  ]);

  const instructores = this.getTextValue(formato, [
    'instructores_tentativos',
    'formato1_instructores_tentativos',
    'instructores',
    'instructor_tentativo',
    'instructor'
  ]);

  const fechaEjecucion = this.getTextValue(formato, [
    'formato1_fecha_ejecucion',
    'fecha_ejecucion',
    'fecha_de_ejecucion',
    'fecha_ejecucion_reporte'
  ]);

  

  const consecuencias = this.getConsecuencias(formato);
  const documentos = this.getDocumentos(formato);
  const tiposNecesidad = this.textoTiposNecesidad(formato);


  // =====================================================
  // CARGAR IMÁGENES
  // =====================================================

  const logoEncabezado = await this.imagenBase64(
  'assets/img/encabezado.jpg');

  const logoPiePagina = await this.imagenBase64(
  'assets/img/footer.jpeg');

  


  // =====================================================
  // CREAR PDF
  // =====================================================


  const documentDefinition: any = {

  pageSize: 'A4',

  // [izquierda, arriba, derecha, abajo]
  // Aumentamos arriba y abajo para dar espacio a las imágenes

  pageMargins: [40, 80, 40, 80],

  // =====================================================
  // ENCABEZADO
  // =====================================================

  header: {
    image: 'logoEncabezado',
    width: 500,
    alignment: 'center',
    margin: [0, 10, 0, 10]
  },

  content: [

    // =====================================================
    // FORMATO 01
    // =====================================================


    // =====================================================
    // 1. INFORMACIÓN DE LA INSTITUCIÓN / EMPRESA
    // =====================================================

    {
      table: {

        widths: ['35%', '32.5%', '32.5%'],

        body: [

          [
            {
              text: 'TIPO DE' +'\n'+'NECESIDAD',
              style: 'tituloSeccion',
              alignment: 'left',
              margin: [0, 2, 0, 2]
            },
            {
              colSpan: 2,
              table: {
                widths: ['*', 28.35],
                body: [[
                  {
                    text: tiposNecesidad,
                    margin: [5, 1, 0, 1]
                  },
                  { 
                    svg: `
                      <svg width="30" height="30" viewBox="0 0 30 55">
                        <g transform="rotate(-90 15 40)">
                          <text
                            x="15"
                            y="45"
                            text-anchor="middle"
                            font-family="Arial"
                            font-size="14"
                            font-weight="bold">
                            NSIB
                          </text>
                        </g>
                      </svg>
                    `,
                    fillColor: '#FFFF00',
                    alignment: 'center',
                    bold: true,
                    margin: [0, 0, 0, 0],
                    angle: 90
                  }
                ]]
              },
              layout: 'noBorders'
            },
            {}
          ],

          [
            {
              text: 'INFORMACIÓN DE LA INSTITUCIÓN / EMPRESA',
              style: 'tituloSeccion',
              colSpan: 3,
              alignment: 'left',
              margin: [0, 2, 0, 2]
            },
            {},
            {}
          ],

          [
            {
              text: 'Fecha de elaboración',
              style: 'campo'
            },
            {
              text: fechaElaboracion || '',
              colSpan: 2
            },
            {}
          ],

          [
            {
              text: 'Institución / Empresa',
              style: 'campo'
            },
            {
              text: formato.formato1_institucion || '',
              colSpan: 2
            },
            {}
          ],

          [
            {
              text: 'Persona de contacto',
              style: 'campo'
            },
            {
              text: formato.formato1_persona_contacto || '',
              colSpan: 2
            },
            {}
          ],

          [
            {
              text: 'Teléfono',
              style: 'campo'
            },
            formato.formato1_telefono || '',
            {
              text: 'E-mail: ' + (correo || ''),
              style: 'campo'
            }
          ]

        ]

      },

      layout: {
        hLineWidth: function () {
          return 0.8;
        },

        vLineWidth: function () {
          return 0.8;
        },

        paddingLeft: function () {
          return 6;
        },

        paddingRight: function () {
          return 3;
        },

        paddingTop: function () {
          return 3;
        },

        paddingBottom: function () {
          return 3;
        }
      },

      margin: [0, 5, 0, 10]
    },

    // =====================================================
    // 2. DETALLE DE CAPACITACIÓN
    // =====================================================

    {
      table: {

        widths: ['35%', '32.5%', '32.5%'],

        body: [

          [
            {
              text: 'DETALLE DE CAPACITACIÓN',
              style: 'tituloSeccion',
              colSpan: 3,
              alignment: 'left',
              margin: [0, 5, 0, 5]
            },
            {},
            {}
          ],

          [
            {
              text: 'Temáticas tentativas',
              style: 'campo'
            },
            {
              text: (tematicas || '')
                .split(',')
                .map((t: string) => t.trim())
                .join('\n'),
              colSpan: 2
            },
            {}
          ],

          [
            {
              text: 'Mes de ejecución',
              style: 'campo'
            },
            mesEjecucion || '',
            {
              text: 'Modalidad: ' +
                (formato.modalidad_nombre || formato.modalidad || ''),
              style: 'campo'
            }
          ],

          [
            {
              text: 'Número de personas',
              style: 'campo'
            },
            numeroPersonas || '',
            {
              text: 'Carga horaria: ' + (cargaHoraria || ''),
              style: 'campo'
            }
          ]

        ]

      },

      layout: {
        hLineWidth: function () {
          return 0.8;
        },

        vLineWidth: function () {
          return 0.8;
        },

        paddingLeft: function () {
          return 6;
        },

        paddingRight: function () {
          return 3;
        },

        paddingTop: function () {
          return 3;
        },

        paddingBottom: function () {
          return 3;
        }
      },

      margin: [0, 5, 0, 10]
    },

    // =====================================================
    // 3. PROPUESTA
    // =====================================================

    {
      table: {

        widths: ['35%', '32.5%', '32.5%'],

        body: [

          [
            {
              text: 'PROPUESTA',
              style: 'tituloSeccion',
              colSpan: 3,
              alignment: 'left',
              margin: [0, 5, 0, 5]
            },
            {},
            {}
          ],

          [
            {
              text: 'Instructores tentativos',
              style: 'campo'
            },
            {
              text: (instructores || '')
                .split(',')
                .map((i: string) => i.trim())
                .join('\n'),
              colSpan: 2
            },
            {}
          ],

          [
            {
              text: 'Fecha de ejecución',
              style: 'campo'
            },
            fechaEjecucion || '',
            {
              text: 'Inversión: ' +
                (formato.formato1_inversion
                  ? '$ ' + formato.formato1_inversion
                  : ''),
              style: 'campo'
            }
          ]

        ]

      },

      layout: {
        hLineWidth: function () {
          return 0.8;
        },

        vLineWidth: function () {
          return 0.8;
        },

        paddingLeft: function () {
          return 6;
        },

        paddingRight: function () {
          return 3;
        },

        paddingTop: function () {
          return 3;
        },

        paddingBottom: function () {
          return 3;
        }
      },

      margin: [0, 5, 0, 10]
    },

    // =====================================================
    // 4. CONSECUENCIAS
    // =====================================================

    {
      table: {

        widths: ['35%', '65%'],

        body: [

          [
            {
              text: 'CONSECUENCIAS POTENCIALES DE NO EJECUTAR EL EVENTO DE CAPACITACIÓN',
              style: 'tituloSeccion',
              colSpan: 2,
              alignment: 'left',
              margin: [0, 5, 0, 5]
            },
            {}
          ],

          [
            {
              text: consecuencias[0] || '',
              colSpan: 2,
              style: 'campo'
            },
            {}
          ],

          [
            {
              text: consecuencias[1] || '',
              colSpan: 2,
              style: 'campo'
            },
            {}
          ],

          [
            {
              text: consecuencias[2] || '',
              colSpan: 2,
              style: 'campo'
            },
            {}
          ]

        ]

      },

      layout: {
        hLineWidth: function () {
          return 0.8;
        },

        vLineWidth: function () {
          return 0.8;
        },

        paddingLeft: function () {
          return 3;
        },

        paddingRight: function () {
          return 3;
        },

        paddingTop: function () {
          return 3;
        },

        paddingBottom: function () {
          return 3;
        }
      },

      margin: [0, 5, 0, 10]
    },

    // =====================================================
    // DOCUMENTOS ANEXADOS
    // =====================================================

    {
      table: {

        widths: ['33.33%', '33.33%', '33.34%'],

        body: [

          [
            {
              text: 'DOCUMENTOS ANEXOS',
              style: 'tituloSeccion',
              colSpan: 3,
              alignment: 'left',
              margin: [0, 5, 0, 5]
            },
            {},
            {}
          ],

          [
            {
              text: documentos.actaDescripcion
                ? 'Acta de trabajo: ' + documentos.actaDescripcion
                : 'Acta de trabajo: [ ] Sí    [X] No',
              style: 'campo',
              alignment: 'center'
            },

            {
              text: 'Acuerdo de calidad: ' +
                this.estadoDocumento(documentos.acuerdo),
              style: 'campo',
              alignment: 'center',
              link: this.urlArchivo(documentos.acuerdoRuta)
            },

            {
              text: 'Criterio de calificación: ' +
                this.estadoDocumento(documentos.criterio),
              style: 'campo',
              alignment: 'center',
              link: this.urlArchivo(documentos.criterioRuta)
            }
          ]

        ]

      },

      layout: {
        hLineWidth: function () {
          return 0.8;
        },

        vLineWidth: function () {
          return 0.8;
        },

        paddingLeft: function () {
          return 6;
        },

        paddingRight: function () {
          return 3;
        },

        paddingTop: function () {
          return 3;
        },

        paddingBottom: function () {
          return 3;
        }
      },

      margin: [0, 5, 0, 10]
    },


    // =====================================================
    // 6. FIRMA
    // =====================================================

{
  stack: [

    // CUADRO REDONDEADO
    {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 260,
          h: 130,
          r: 10,
          lineWidth: 0.8
        }
      ]
    },

    // CONTENIDO DENTRO DEL CUADRO
    {
      stack: [
        {
          text: '\n\n\n\n\n\n'
        },
        {
          text: '_____________________________________________',
          alignment: 'left',
          margin: [30, 0, 0, 4]
        },
        {
          text: 'ASISTENTE DE PROCESOS DE CAPACITACIÓN',
          bold: true,
          fontSize: 8,
          alignment: 'left',
          margin:[40, 0, 0, 4]
        },

        {
          text :'DIRECCIÓN DE EDUCACIÓN CONTINUA, A DISTANCIA Y VIRTUAL',
          fontSize:7,
          alignment:'left',
          margin:[30, 0, 0, 4]
        },

        {
          text: '(DEaDV)',
          fontSize:7,
          alignment:'left',
          margin:[120, 0, 0, 4]
        }

      ],

      width: 260,
      margin: [0, -115, 0, 0]
    }

  ],

  alignment: 'left',
  margin: [0, 5, 0, 0]
},
 {
      text: 'NSIB: Nivel de Sensibilidad de la Información MEDIO',
      bold: false,
      fontSize: 9,
      alignment: 'left',
      margin: [20, 5, 0, 0]
    }

  ],

  // =====================================================
  // ESTILOS
  // =====================================================

  styles: {

    tituloSeccion: {
      fontSize: 11,
      bold: true
    },

    campo: {
      bold: true
    }

  },

  defaultStyle: {
    fontSize: 9
  },

  // =====================================================
  // PIE DE PÁGINA
  // =====================================================

  footer: function (
    currentPage: number,
    pageCount: number
  ) {

    return {
      stack: [

        {
          image: 'logoPiePagina',
          width: 500,
          alignment: 'center',
          margin: [0, 40, 0, 5]
        },

      ]
    };

  },

  // =====================================================
  // IMÁGENES
  // =====================================================

  images: {

    logoEncabezado,
    logoPiePagina

  }

};


  console.log('GENERANDO PDF...');

  (pdfMake as any)
    .createPdf(documentDefinition)
    .open();

}
  // ==========================================
  // CARGAR FORMATOS
  // ==========================================
  cargarListaFormatos1(): void {

    const data = {
      fx: 'verformato1',
      d: {},
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    console.log('================================');
    console.log('CONSULTANDO FORMATOS 01');
    console.log('DATOS ENVIADOS:', data);
    console.log('================================');

    this.userService.getListaFormatos1(data).subscribe({

      next: (res: any) => {

        console.log('RESPUESTA COMPLETA:', res);

        // ==========================================
        // VALIDAR RESPUESTA
        // ==========================================

        if (!res) {

          console.error('El servidor no devolvió respuesta');

          this.listaformatos1 = [];

          return;
        }

        console.log('DATA:', res.data);

        // ==========================================
        // VALIDAR DATA
        // ==========================================

        if (!res.data) {

          console.error(
            'La respuesta no contiene la propiedad data'
          );

          this.listaformatos1 = [];

          return;
        }

        console.log(
          'SUCCESS:',
          res.data.success
        );

        console.log(
          'ESTADO:',
          res.data.estado
        );

        console.log(
          'ITEM:',
          res.data.item
        );


        // ==========================================
        // CARGAR REGISTROS
        // ==========================================

        if (
          res.data.success === true &&
          res.data.estado > 0
        ) {

         

          if (
            Array.isArray(res.data.item)
          ) {

             

            this.listaformatos1 = res.data.item;
                console.log('================================');
    console.log('PRUEBA RESPUESTA DEL SERVIDOR');
    console.log('PRIMER REGISTRO:', this.listaformatos1[0]);
    console.log(
      'CAMPOS:',
      Object.keys(this.listaformatos1[0])
    );
    console.log(
      'TEMÁTICAS RECIBIDAS:',
      this.listaformatos1[0].tematicas_tentativas
    );
    console.log('================================');
            console.log('REGISTRO COMPLETO:', this.listaformatos1[0]);
            console.log(
  'CAMPOS DEL FORMATO 01:',
  Object.keys(this.listaformatos1[0])
);

console.log(
  'DATOS COMPLETOS DEL FORMATO 01:',
  this.listaformatos1[0]
);

            console.log(
              'FORMATOS ENCONTRADOS:',
              this.listaformatos1.length
            );

            console.table(
              this.listaformatos1
            );

          } else {

            console.warn(
              'El servidor respondió correctamente, pero item no es un arreglo'
            );

            this.listaformatos1 = [];
          }

        } else {

          console.warn(
            'El servidor no encontró registros de Formato 01'
          );

          this.listaformatos1 = [];
        }

      },

      // ==========================================
      // ERROR
      // ==========================================

      error: (err: HttpErrorResponse) => {

        console.error(
          'ERROR AL CONSULTAR FORMATOS 01:',
          err
        );
        
        this.listaformatos1 = [];

        Swal.fire(
          'Error',
          'No se pudieron cargar los registros de Formato 01',
          'error'
        );
      }

    });
  }

  private cargarTiposNecesidad(): void {
    const data = {
      fx: 'tipocapacitacion',
      d: {},
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    this.userService.getListaFormatos1(data).subscribe({
      next: (res: any) => {
        if (res?.data?.success && res.data.estado > 0 && Array.isArray(res.data.item)) {
          this.tiposNecesidad = res.data.item;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('No se pudo cargar el catálogo de tipos de necesidad:', err);
      }
    });
  }

}
