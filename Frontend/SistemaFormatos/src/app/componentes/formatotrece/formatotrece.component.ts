import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';

type OpcionPaginaWeb = 'paginaWebBanner' | 'paginaWebMiniatura' | 'paginaWebZoom' | 'paginaWebArticulo';
type RespuestaSiNo = 'SI' | 'NO' | '';
type TipoPublicacion = 'PUBLICIDAD' | 'INFORMATIVA';
type OpcionRedSocial = 'redSocialPost' | 'redSocialCarrusel' | 'redSocialReel';
type OpcionVideoSiNo = 'television' | 'video2Min';
type TipoVideo45s = 'VIVENCIAL' | 'INFORMATIVO' | 'NO' | '';
interface PublicacionUnica {
  tipoMedio: string;
  fechaPublicacion: string;
  urlRedSocial: string;
  tiposRecurso: string[];
  tipoPublicacion: TipoPublicacion | '';
  medioUtaSeleccionado: boolean;
  medioUtaUrl: string;
  impresoSeleccionado: boolean;
  copiasImpresas: number | null;
}

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

interface MedioUtaAdicional {
  fechaPublicacion: string;
  url: string;
}

@Component({
  selector: 'app-formatotrece',
  templateUrl: './formatotrece.component.html',
  styleUrls: ['./formatotrece.component.css']
})
export class FormatotreceComponent implements OnInit {
  formato13 = {
    lineaGraficaInstitucional: '',
    alianzaConvenio: '',
    identificadores: '',
    aspectosConsiderar: '',
    otros: '',
    medioUtaFechaPublicacion: '',
    medioUtaUrl: '',
    medioUtaSeleccionado: false,
    impresoSeleccionado: false,
    copiasImpresas: null as number | null,
    tipoMedio: '',
    tiposRecurso: [] as string[],
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
  mediosUtaAdicionales: MedioUtaAdicional[] = [];
  publicacionesAdicionales: PublicacionUnica[] = [];
  guardando = false;
  cursosFormato6: any[] = [];
  formato6SeleccionadoCodigo: number | null = null;
  formato6ModuloId: number | null = null;
  tiposMedio: string[] = [];
  cargandoTiposMedio = false;
  tiposRecurso = ['Video', 'Imagen', 'Texto', 'URL'];

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarCursosFormato6();
    this.cargarTiposMedio();
  }

  get cursoSeleccionado(): any {
    return this.cursosFormato6.find(
      (curso) => Number(curso.formato6_codigo) === Number(this.formato6SeleccionadoCodigo)
    ) || null;
  }

  get modulosDisponibles(): { id: number; nombre: string }[] {
    return this.cursoSeleccionado?.modulos || [];
  }

  cargarCursosFormato6(): void {
    this.modulosService.obtenerFormato6({ fx: 'getformato6', d: { incluirInactivos: true } }).subscribe({
      next: (respuesta: any) => {
        this.cursosFormato6 = respuesta?.data?.success && Array.isArray(respuesta.data.item)
          ? respuesta.data.item.filter((curso: any) => Array.isArray(curso.modulos) && curso.modulos.length > 0)
          : [];
      },
      error: () => {
        this.cursosFormato6 = [];
        Swal.fire('Error', 'No se pudieron cargar los cursos del Formato 6.', 'error');
      }
    });
  }

  cargarTiposMedio(): void {
    this.cargandoTiposMedio = true;
    this.modulosService.obtenerTiposMedioFormato13({ fx: 'gettiposmedioformato13', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cargandoTiposMedio = false;
        if (respuesta?.data?.success && Array.isArray(respuesta.data.item)) {
          this.tiposMedio = respuesta.data.item.map((medio: any) => medio.tipo_medio_nombre);
          return;
        }

        this.tiposMedio = [];
        Swal.fire('Error', respuesta?.data?.message || 'No se pudieron cargar los tipos de medio.', 'error');
      },
      error: () => {
        this.cargandoTiposMedio = false;
        this.tiposMedio = [];
        Swal.fire('Error', 'No se pudieron cargar los tipos de medio.', 'error');
      }
    });
  }

  agregarMedioUta(): void {
    this.mediosUtaAdicionales.push({ fechaPublicacion: '', url: '' });
  }

  eliminarMedioUta(indice: number): void {
    this.mediosUtaAdicionales.splice(indice, 1);
  }

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

  alternarSeleccionPublicacion(publicacion: PublicacionUnica, recurso: string, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      if (!publicacion.tiposRecurso.includes(recurso)) {
        publicacion.tiposRecurso.push(recurso);
      }
      return;
    }

    publicacion.tiposRecurso = publicacion.tiposRecurso.filter((item) => item !== recurso);
  }

  seleccionarTipoPublicacionItem(publicacion: PublicacionUnica, tipo: TipoPublicacion, evento: Event): void {
    if ((evento.target as HTMLInputElement).checked) {
      publicacion.tipoPublicacion = tipo;
    }
  }

  agregarPublicacionAdicional(): void {
    this.publicacionesAdicionales.push({
      tipoMedio: '',
      fechaPublicacion: '',
      urlRedSocial: '',
      tiposRecurso: [],
      tipoPublicacion: '',
      medioUtaSeleccionado: false,
      medioUtaUrl: '',
      impresoSeleccionado: false,
      copiasImpresas: null
    });
  }

  eliminarPublicacionAdicional(indice: number): void {
    this.publicacionesAdicionales.splice(indice, 1);
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
      if (formulario.invalid) {
        Swal.fire('Datos incompletos', 'Completa los campos obligatorios antes de guardar el Formato 13.', 'warning');
      }
      return;
    }
    if (!this.formato6SeleccionadoCodigo || !this.formato6ModuloId) {
      Swal.fire('Dato requerido', 'Selecciona un curso y un módulo del Formato 6.', 'warning');
      return;
    }
    const publicaciones = [this.formato13, ...this.publicacionesAdicionales];
    if (publicaciones.some((publicacion) => !publicacion.tipoMedio || !publicacion.tipoPublicacion || publicacion.tiposRecurso.length === 0)) {
      Swal.fire('Dato requerido', 'Completa el tipo de medio, tipo de recurso y tipo de publicación en cada publicación.', 'warning');
      return;
    }
    if (publicaciones.some((publicacion) => publicacion.medioUtaSeleccionado && !publicacion.medioUtaUrl)) {
      Swal.fire('Dato requerido', 'Ingresa la URL de Medios UTA en cada publicación que lo seleccione.', 'warning');
      return;
    }
    if (publicaciones.some((publicacion) => publicacion.impresoSeleccionado && (!publicacion.copiasImpresas || publicacion.copiasImpresas < 1))) {
      Swal.fire('Dato requerido', 'Ingresa un número de copias impresas mayor que cero en cada publicación impresa.', 'warning');
      return;
    }

    this.guardando = true;
    const publicacionesRedSocial = this.publicacionesAdicionales.map((publicacion) => ({
      fechaPublicacion: publicacion.fechaPublicacion,
      tipoPublicacion: publicacion.tipoPublicacion,
      urlRedSocial: publicacion.urlRedSocial,
      tiposMedio: JSON.stringify(publicacion.tipoMedio ? [publicacion.tipoMedio] : []),
      tiposRecurso: JSON.stringify(publicacion.tiposRecurso),
      medioUta: publicacion.medioUtaSeleccionado ? 'SI' : 'NO',
      medioUtaUrl: publicacion.medioUtaSeleccionado ? publicacion.medioUtaUrl : '',
      impreso: publicacion.impresoSeleccionado ? 'SI' : 'NO',
      copiasImpresas: publicacion.impresoSeleccionado ? publicacion.copiasImpresas : null
    }));
    const publicacionesPaginaWeb = this.publicacionesPaginaWebAdicionales.map((item) => ({
      ...item,
      banner: item.banner || 'NO',
      miniatura: item.miniatura || 'NO',
      zoom: item.zoom || 'NO',
      articulo: item.articulo || 'NO'
    }));
    const publicacionesVideo = this.publicacionesVideoAdicionales.map((item) => ({
      ...item,
      television: item.television || 'NO',
      video45s: item.video45s || 'NO',
      video2Min: item.video2Min || 'NO'
    }));
    const datos = {
      ...this.formato13,
      formato6Codigo: this.formato6SeleccionadoCodigo,
      formato6ModuloId: this.formato6ModuloId,
      tiposMedio: JSON.stringify(this.formato13.tipoMedio ? [this.formato13.tipoMedio] : []),
      tiposRecurso: JSON.stringify(this.formato13.tiposRecurso),
      medioUta: this.formato13.medioUtaSeleccionado ? 'SI' : 'NO',
      impreso: this.formato13.impresoSeleccionado ? 'SI' : 'NO',
      copiasImpresas: this.formato13.impresoSeleccionado ? this.formato13.copiasImpresas : null,
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
      publicacionesVideo,
      mediosUtaAdicionales: this.mediosUtaAdicionales
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
          this.formato6SeleccionadoCodigo = null;
          this.formato6ModuloId = null;
          this.publicacionesPaginaWebAdicionales = [];
          this.publicacionesRedSocialAdicionales = [];
          this.publicacionesVideoAdicionales = [];
          this.mediosUtaAdicionales = [];
          this.publicacionesAdicionales = [];
          this.formato13 = {
            lineaGraficaInstitucional: '',
            alianzaConvenio: '',
            identificadores: '',
            aspectosConsiderar: '',
            otros: '',
            medioUtaFechaPublicacion: '',
            medioUtaUrl: '',
            medioUtaSeleccionado: false,
            impresoSeleccionado: false,
            copiasImpresas: null,
            tipoMedio: '',
            tiposRecurso: [],
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