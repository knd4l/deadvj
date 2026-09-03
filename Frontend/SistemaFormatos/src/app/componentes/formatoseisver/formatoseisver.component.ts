import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ModulosService } from '../../servicios/modulos.service';

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

    console.log(
      'FORMATO 06 SELECCIONADO:',
      formato
    );

    Swal.fire({
      icon: 'info',
      title: 'Formato 06',
      text: 'Aquí posteriormente mostraremos el formulario completo.'
    });

  }

}