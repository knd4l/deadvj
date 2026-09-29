import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';

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
            publicacionesPaginaWeb: this.leerPublicaciones(formato.formato13_pagina_web_adicionales),
            publicacionesRedSocial: this.leerPublicaciones(formato.formato13_red_social_adicionales),
            publicacionesVideo: this.leerPublicaciones(formato.formato13_video_adicionales)
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
}