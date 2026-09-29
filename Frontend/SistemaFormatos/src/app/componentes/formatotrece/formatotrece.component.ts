import { Component } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';

type OpcionPaginaWeb = 'paginaWebBanner' | 'paginaWebMiniatura' | 'paginaWebZoom' | 'paginaWebArticulo';
type RespuestaSiNo = 'SI' | 'NO' | '';
type TipoPublicacion = 'PUBLICIDAD' | 'INFORMATIVA';
type OpcionRedSocial = 'redSocialPost' | 'redSocialCarrusel' | 'redSocialReel';
type OpcionVideoSiNo = 'television' | 'video2Min';
type TipoVideo45s = 'VIVENCIAL' | 'INFORMATIVO' | 'NO' | '';

interface PublicacionPaginaWebAdicional {
  fechaPublicacion: string;
  tipoPublicacion: TipoPublicacion | '';
  banner: RespuestaSiNo;
  miniatura: RespuestaSiNo;
  zoom: RespuestaSiNo;
  articulo: RespuestaSiNo;
  url: string;
}

interface PublicacionRedSocialAdicional {
  fechaPublicacion: string;
  tipoPublicacion: TipoPublicacion | '';
  post: RespuestaSiNo;
  postUrl: string;
  carrusel: RespuestaSiNo;
  carruselUrl: string;
  reel: RespuestaSiNo;
  reelUrl: string;
  otro: string;
  urlRedSocial: string;
}

interface PublicacionVideoAdicional {
  fechaPublicacion: string;
  tipoPublicacion: TipoPublicacion | '';
  television: RespuestaSiNo;
  video45s: TipoVideo45s;
  video2Min: RespuestaSiNo;
  video2MinExplicacion: string;
  urlRedSocial: string;
}

@Component({
  selector: 'app-formatotrece',
  templateUrl: './formatotrece.component.html',
  styleUrls: ['./formatotrece.component.css']
})
export class FormatotreceComponent {
  formato13 = {
    lineaGraficaInstitucional: '',
    alianzaConvenio: '',
    identificadores: '',
    aspectosConsiderar: '',
    otros: '',
    paginaWebFechaPublicacion: '',
    paginaWebTipoPublicacion: '' as TipoPublicacion | '',
    paginaWebBanner: '' as RespuestaSiNo,
    paginaWebMiniatura: '' as RespuestaSiNo,
    paginaWebZoom: '' as RespuestaSiNo,
    paginaWebArticulo: '' as RespuestaSiNo,
    paginaWebUrl: '',
    fechaPublicacion: '',
    tipoPublicacion: '' as TipoPublicacion | '',
    redSocialPost: '' as RespuestaSiNo,
    redSocialPostUrl: '',
    redSocialCarrusel: '' as RespuestaSiNo,
    redSocialCarruselUrl: '',
    redSocialReel: '' as RespuestaSiNo,
    redSocialReelUrl: '',
    otroRedSocial: '',
    urlRedSocial: '',
    videoFechaPublicacion: '',
    videoTipoPublicacion: '' as TipoPublicacion | '',
    television: '' as RespuestaSiNo,
    video45s: '' as TipoVideo45s,
    video2Min: '' as RespuestaSiNo,
    video2MinExplicacion: '',
    videoUrlRedSocial: ''
  };
  publicacionesPaginaWebAdicionales: PublicacionPaginaWebAdicional[] = [];
  publicacionesRedSocialAdicionales: PublicacionRedSocialAdicional[] = [];
  publicacionesVideoAdicionales: PublicacionVideoAdicional[] = [];
  guardando = false;

  constructor(private modulosService: ModulosService) {}

  agregarPaginaWeb(): void {
    this.publicacionesPaginaWebAdicionales.push({
      fechaPublicacion: '',
      tipoPublicacion: '',
      banner: '',
      miniatura: '',
      zoom: '',
      articulo: '',
      url: ''
    });
  }

  agregarRedSocial(): void {
    this.publicacionesRedSocialAdicionales.push({
      fechaPublicacion: '',
      tipoPublicacion: '',
      post: '',
      postUrl: '',
      carrusel: '',
      carruselUrl: '',
      reel: '',
      reelUrl: '',
      otro: '',
      urlRedSocial: ''
    });
  }

  agregarVideo(): void {
    this.publicacionesVideoAdicionales.push({
      fechaPublicacion: '',
      tipoPublicacion: '',
      television: '',
      video45s: '',
      video2Min: '',
      video2MinExplicacion: '',
      urlRedSocial: ''
    });
  }

  eliminarPublicacion(tipo: 'paginaWeb' | 'redSocial' | 'video', indice: number): void {
    if (tipo === 'paginaWeb') {
      this.publicacionesPaginaWebAdicionales.splice(indice, 1);
    } else if (tipo === 'redSocial') {
      this.publicacionesRedSocialAdicionales.splice(indice, 1);
    } else {
      this.publicacionesVideoAdicionales.splice(indice, 1);
    }
  }

  seleccionarTipoAdicional(publicacion: { tipoPublicacion: TipoPublicacion | '' }, tipo: TipoPublicacion, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      publicacion.tipoPublicacion = tipo;
    }
  }

  seleccionarOpcionAdicional(publicacion: any, campo: string, respuesta: RespuestaSiNo, evento: Event): void {
    if (!(evento.target as HTMLInputElement).checked) {
      return;
    }

    publicacion[campo] = respuesta;
    if (respuesta === 'NO') {
      const urls: { [key: string]: string } = {
        post: 'postUrl',
        carrusel: 'carruselUrl',
        reel: 'reelUrl'
      };
      if (urls[campo]) {
        publicacion[urls[campo]] = '';
      }
      if (campo === 'video2Min') {
        publicacion.video2MinExplicacion = '';
      }
    }
  }

  seleccionarVideo45sAdicional(publicacion: PublicacionVideoAdicional, tipo: TipoVideo45s, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      publicacion.video45s = tipo;
    }
  }

  seleccionarOpcionPaginaWeb(campo: OpcionPaginaWeb, respuesta: RespuestaSiNo, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      this.formato13[campo] = respuesta;
    }
  }

  seleccionarTipoPublicacion(tipo: TipoPublicacion, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      this.formato13.tipoPublicacion = tipo;
    }
  }

  seleccionarTipoPublicacionPaginaWeb(tipo: TipoPublicacion, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      this.formato13.paginaWebTipoPublicacion = tipo;
    }
  }

  seleccionarTipoPublicacionVideo(tipo: TipoPublicacion, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      this.formato13.videoTipoPublicacion = tipo;
    }
  }

  seleccionarOpcionRedSocial(campo: OpcionRedSocial, respuesta: RespuestaSiNo, evento: Event): void {
    if (!(evento.target as HTMLInputElement).checked) {
      return;
    }

    this.formato13[campo] = respuesta;
    if (respuesta === 'NO') {
      if (campo === 'redSocialPost') {
        this.formato13.redSocialPostUrl = '';
      } else if (campo === 'redSocialCarrusel') {
        this.formato13.redSocialCarruselUrl = '';
      } else {
        this.formato13.redSocialReelUrl = '';
      }
    }
  }

  seleccionarOpcionVideo(campo: OpcionVideoSiNo, respuesta: RespuestaSiNo, evento: Event): void {
    if (!(evento.target as HTMLInputElement).checked) {
      return;
    }

    this.formato13[campo] = respuesta;
    if (campo === 'video2Min' && respuesta === 'NO') {
      this.formato13.video2MinExplicacion = '';
    }
  }

  seleccionarTipoVideo45s(tipo: TipoVideo45s, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      this.formato13.video45s = tipo;
    }
  }

  guardarFormato13(formulario: any): void {
    if (formulario.invalid || this.guardando) {
      formulario.control.markAllAsTouched();
      return;
    }
    if (!this.formato13.tipoPublicacion) {
      Swal.fire('Dato requerido', 'Selecciona el tipo de publicación.', 'warning');
      return;
    }
    if (!this.formato13.paginaWebTipoPublicacion || !this.formato13.videoTipoPublicacion) {
      Swal.fire('Dato requerido', 'Selecciona el tipo de publicación para Página web y Videos.', 'warning');
      return;
    }
    if (
      this.publicacionesPaginaWebAdicionales.some((item) => !item.tipoPublicacion) ||
      this.publicacionesRedSocialAdicionales.some((item) => !item.tipoPublicacion) ||
      this.publicacionesVideoAdicionales.some((item) => !item.tipoPublicacion)
    ) {
      Swal.fire('Dato requerido', 'Selecciona el tipo de publicación en cada publicación adicional.', 'warning');
      return;
    }

    this.guardando = true;
    const publicacionesPaginaWeb = this.publicacionesPaginaWebAdicionales.map((item) => ({
      ...item,
      banner: item.banner || 'NO',
      miniatura: item.miniatura || 'NO',
      zoom: item.zoom || 'NO',
      articulo: item.articulo || 'NO'
    }));
    const publicacionesRedSocial = this.publicacionesRedSocialAdicionales.map((item) => ({
      ...item,
      post: item.post || 'NO',
      carrusel: item.carrusel || 'NO',
      reel: item.reel || 'NO'
    }));
    const publicacionesVideo = this.publicacionesVideoAdicionales.map((item) => ({
      ...item,
      television: item.television || 'NO',
      video45s: item.video45s || 'NO',
      video2Min: item.video2Min || 'NO'
    }));
    const datos = {
      ...this.formato13,
      paginaWebBanner: this.formato13.paginaWebBanner || 'NO',
      paginaWebMiniatura: this.formato13.paginaWebMiniatura || 'NO',
      paginaWebZoom: this.formato13.paginaWebZoom || 'NO',
      paginaWebArticulo: this.formato13.paginaWebArticulo || 'NO',
      redSocialPost: this.formato13.redSocialPost || 'NO',
      redSocialCarrusel: this.formato13.redSocialCarrusel || 'NO',
      redSocialReel: this.formato13.redSocialReel || 'NO',
      television: this.formato13.television || 'NO',
      video45s: this.formato13.video45s || 'NO',
      video2Min: this.formato13.video2Min || 'NO',
      publicacionesPaginaWeb,
      publicacionesRedSocial,
      publicacionesVideo
    };
    this.modulosService.insertarFormato13({
      fx: 'insertformato13',
      d: datos
    }).subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (respuesta?.data?.success) {
          Swal.fire('Guardado', 'El Formato 13 se guardó correctamente.', 'success');
          formulario.resetForm();
          this.publicacionesPaginaWebAdicionales = [];
          this.publicacionesRedSocialAdicionales = [];
          this.publicacionesVideoAdicionales = [];
          this.formato13 = {
            lineaGraficaInstitucional: '',
            alianzaConvenio: '',
            identificadores: '',
            aspectosConsiderar: '',
            otros: '',
            paginaWebFechaPublicacion: '',
            paginaWebTipoPublicacion: '' as TipoPublicacion | '',
            paginaWebBanner: '',
            paginaWebMiniatura: '',
            paginaWebZoom: '',
            paginaWebArticulo: '',
            paginaWebUrl: '',
            fechaPublicacion: '',
            tipoPublicacion: '' as TipoPublicacion | '',
            redSocialPost: '',
            redSocialPostUrl: '',
            redSocialCarrusel: '',
            redSocialCarruselUrl: '',
            redSocialReel: '',
            redSocialReelUrl: '',
            otroRedSocial: '',
            urlRedSocial: '',
            videoFechaPublicacion: '',
            videoTipoPublicacion: '' as TipoPublicacion | '',
            television: '',
            video45s: '',
            video2Min: '',
            video2MinExplicacion: '',
            videoUrlRedSocial: ''
          };
        } else {
          Swal.fire('Error', respuesta?.data?.message || 'No se pudo guardar el Formato 13.', 'error');
        }
      },
      error: () => {
        this.guardando = false;
        Swal.fire('Error', 'No se pudo guardar el Formato 13.', 'error');
      }
    });
  }
}