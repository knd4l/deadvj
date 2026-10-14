import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

interface Formato9 {
  formato9_codigo: number;
  formato6_codigo: number;
  formato9_modulo_id: number;
  formato9_modulo_nombre: string;
  formato9_textos: string[];
  formato9_fecha_creacion: string;
  formato1_codigo_curso: string | null;
  formato1_curso_definido: string;
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

      const documento = {
        pageSize: 'A4',
        pageMargins: [40, 132, 40, 78],
        header: { image: encabezado, width: 515, alignment: 'center', margin: [0, 12, 0, 0] },
        footer: { image: pie, width: 515, alignment: 'center', margin: [0, 0, 0, 12] },
        content: formato.formato9_textos.map((texto) => ({
            text: texto,
            style: 'contractText',
            alignment: 'justify',
            margin: [0, 0, 0, 10]
          })),
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
