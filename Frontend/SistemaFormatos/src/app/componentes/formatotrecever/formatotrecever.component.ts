import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-formatotrecever',
  templateUrl: './formatotrecever.component.html',
  styleUrls: ['./formatotrecever.component.css']
})
export class FormatotreceverComponent implements OnInit {
  formatos: any[] = [];
  cargando = false;

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarFormatos();
  }
      
  cargarFormatos(): void {
    this.cargando = true;
    this.modulosService.obtenerFormatos13({ fx: 'getformato13', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargando = false;
        if (respuesta?.data?.success && Array.isArray(respuesta.data.item)) {
          this.formatos = respuesta.data.item.map((formato: any) => ({
            ...formato,
            publicacionesPaginaWeb: this.leerPublicaciones(formato.publicacionesPaginaWebRelacionadas ?? formato.formato13_pagina_web_adicionales),
            publicacionesRedSocial: this.leerPublicaciones(formato.publicacionesRedSocialRelacionadas ?? formato.formato13_red_social_adicionales).map((publicacion: any) => ({
              ...publicacion,
              tiposMedio: this.leerOpciones(publicacion.tiposMedio),
              tiposRecurso: this.leerOpciones(publicacion.tiposRecurso)
            })),
            publicacionesVideo: this.leerPublicaciones(formato.publicacionesVideoRelacionadas ?? formato.formato13_video_adicionales),
            mediosUtaAdicionales: this.leerPublicaciones(formato.mediosUtaRelacionados ?? formato.formato13_medio_uta_adicionales),
            tiposMedio: formato.tipo_medio
              ? [formato.tipo_medio]
              : this.leerOpciones(formato.formato13_red_social_tipos_medio),
            tiposRecurso: this.leerOpciones(formato.formato13_red_social_tipos_recurso),
            cursoNombre: formato.formato1_curso_definido || '',
            publicacionesReporte: this.crearPublicacionesReporte(formato)
          }));
        } else {
          this.formatos = [];
          if (respuesta?.data?.message) {
            Swal.fire('Error', respuesta.data.message, 'error');
          }
        }
      },
      error: () => {
        this.cargando = false;
        this.formatos = [];
        Swal.fire('Error', 'No se pudieron cargar los registros del Formato 13.', 'error');
      }
    });
  }

  private leerPublicaciones(valor: any): any[] {
    if (!valor) {
      return [];
    }

    try {
      const publicaciones = typeof valor === 'string' ? JSON.parse(valor) : valor;
      return Array.isArray(publicaciones) ? publicaciones : [];
    } catch {
      return [];
    }
  }

  private leerOpciones(valor: any): string[] {
    if (!valor) {
      return [];
    }

    try {
      const opciones = typeof valor === 'string' ? JSON.parse(valor) : valor;
      return Array.isArray(opciones) ? opciones : [];
    } catch {
      return [];
    }
  }

  private crearPublicacionesReporte(formato: any): any[] {
    const principal = {
      tipoMedio: formato.tipo_medio || '',
      fechaPublicacion: formato.formato13_red_social_fecha_publicacion || '',
      tipoPublicacion: formato.formato13_red_social_tipo_publicacion || '',
      urlRedSocial: formato.formato13_red_social_url || '',
      tiposRecurso: this.leerOpciones(formato.formato13_red_social_tipos_recurso),
      medioUta: formato.formato13_red_social_medio_uta || 'NO',
      medioUtaUrl: formato.formato13_red_social_medio_uta_url || '',
      impreso: formato.formato13_red_social_impreso || 'NO',
      copiasImpresas: formato.formato13_red_social_copias_impresas || null
    };

    const adicionales = this.leerPublicaciones(
      formato.publicacionesRedSocialRelacionadas ?? formato.formato13_red_social_adicionales
    ).map((publicacion: any) => ({
      ...publicacion,
      tiposMedio: this.leerOpciones(publicacion.tiposMedio),
      tiposRecurso: this.leerOpciones(publicacion.tiposRecurso)
    }));

    return [principal, ...adicionales];
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

  async generarReporte(formato: any): Promise<void> {
    try {
      const encabezado = await this.convertirImagenBase64('assets/img/encabezado.jpg');
      const pie = await this.convertirImagenBase64('assets/img/footer.jpeg');
      const fuentes = pdfFonts as any;
      (pdfMake as any).vfs = fuentes.pdfMake?.vfs || fuentes.vfs;

      const mostrar = (valor: any): string => valor === null || valor === undefined || valor === '' ? '—' : String(valor);
      const mostrarSiNo = (valor: any): string => valor === 'SI' ? 'Sí' : valor === 'NO' ? 'No' : mostrar(valor);
      const formatearFecha = (valor: any): string => mostrar(valor).split(' ')[0];
      const layoutCuadro = { hLineWidth: () => 0.7, vLineWidth: () => 0.7 };
      const publicaciones = Array.isArray(formato.publicacionesReporte) ? formato.publicacionesReporte : [];
      const tablasPublicaciones = publicaciones.map((publicacion: any, indice: number) => ({
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: [{ text: 'Nro. de publicación: ', bold: true }, { text: String(indice + 1) }] },
              { text: [{ text: 'Fecha de publicación: ', bold: true }, { text: formatearFecha(publicacion.fechaPublicacion) }] },
              { text: [{ text: 'de publicación: ', bold: true }, { text: mostrar(publicacion.tipoPublicacion) }] }
            ],
            [
              { text: 'Medio', style: 'tableHeader' },
              { text: 'Recursos', style: 'tableHeader' },
              { text: 'URL', style: 'tableHeader' }
            ],
            [
              { text: mostrar(publicacion.tipoMedio || publicacion.tiposMedio?.join(', ')) },
              { text: mostrar(Array.isArray(publicacion.tiposRecurso) ? publicacion.tiposRecurso.join(', ') : this.leerOpciones(publicacion.tiposRecurso).join(', ')) },
              { text: mostrar(publicacion.urlRedSocial), link: publicacion.urlRedSocial || undefined }
            ],
            [{
              colSpan: 3,
              table: {
                widths: ['*', '*'],
                body: [[
                  { text: `Medios UTA: ${publicacion.medioUta === 'SI' ? 'Sí' : 'No'}${publicacion.medioUtaUrl ? `\nURL: ${publicacion.medioUtaUrl}` : ''}` },
                  { text: `Material impreso: ${publicacion.impreso === 'SI' ? 'Sí' : 'No'}${publicacion.impreso === 'SI' ? `\nTiraje: ${mostrar(publicacion.copiasImpresas)} hojas` : ''}` }
                ]]
              },
              layout: layoutCuadro
            }, {}, {}]
          ]
        },
        layout: layoutCuadro,
        margin: [0, 0, 0, 14]
      }));

      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 132, 40, 78],
        header: { image: encabezado, width: 515, alignment: 'center', margin: [0, 12, 0, 0] },
        footer: { image: pie, width: 515, alignment: 'center', margin: [0, 0, 0, 12] },
        content: [
          { text: 'REPORTE DE PUBLICACIONES - FORMATO 13', style: 'title' },
          {
            table: {
              widths: [85, '*', 70, 48, 55, '*'],
              body: [
                [
                  { text: 'Fecha elaboración', style: 'tableHeader' },
                  { text: formatearFecha(formato.formato6_fecha_elaboracion) },
                  { text: 'Código curso', style: 'tableHeader' },
                  { text: mostrar(formato.formato6_codigo) },
                  { text: 'Modalidad', style: 'tableHeader' },
                  { text: mostrar(formato.formato6_modalidad) }
                ],
                [
                  { text: 'Nombre del curso', style: 'tableHeader' },
                  { text: mostrar(formato.formato1_curso_definido), colSpan: 3 },
                  {},
                  {},
                  { text: 'Área', style: 'tableHeader' },
                  { text: mostrar(formato.formato6_area) }
                ]
              ]
            },
            layout: layoutCuadro,
            margin: [0, 0, 0, 14]
          },
          { text: 'DATOS DEL FORMATO 13', style: 'sectionTitle' },
          {
            table: {
              widths: ['*', '*'],
              body: [
                [{ text: 'Línea gráfica institucional', style: 'tableHeader' }, { text: mostrarSiNo(formato.formato13_linea_grafica_institucional) }],
                [{ text: 'Alianza/convenio', style: 'tableHeader' }, { text: mostrarSiNo(formato.formato13_alianza_convenio) }],
                [{ text: 'Identificadores', style: 'tableHeader' }, { text: mostrar(formato.formato13_identificadores) }],
                [{ text: 'Aspectos a considerar', style: 'tableHeader' }, { text: mostrarSiNo(formato.formato13_aspectos_considerar) }],
                [{ text: 'Otros', style: 'tableHeader' }, { text: mostrar(formato.formato13_otros) }]
              ]
            },
            layout: layoutCuadro,
            margin: [0, 0, 0, 14]
          },
          { text: 'PUBLICACIONES', style: 'sectionTitle' },
          ...(tablasPublicaciones.length ? tablasPublicaciones : [{ text: 'No hay publicaciones registradas.', italics: true }])
        ],
        styles: {
          title: { fontSize: 12, bold: true, alignment: 'center', margin: [0, 8, 0, 14] },
          sectionTitle: { fontSize: 12, bold: true, margin: [0, 4, 0, 8] },
          tableHeader: { bold: true }
        },
        defaultStyle: { fontSize: 9 }
      };

      (pdfMake as any).createPdf(documento).open();
    } catch (error) {
      console.error('No se pudo generar el reporte del Formato 13:', error);
      Swal.fire('Error', 'No se pudo generar el reporte del Formato 13.', 'error');
    }
  }
}