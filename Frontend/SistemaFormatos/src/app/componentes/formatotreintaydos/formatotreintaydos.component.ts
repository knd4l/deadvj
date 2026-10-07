import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModulosService } from '../../servicios/modulos.service';

interface UsuarioFormato32 {
  cedula: string;
  nombres: string;
  apellidos: string;
}

interface CursoFormato32 {
  formato6_codigo: number;
  formato1_codigo_curso: string | null;
  formato1_curso_definido: string;
  modulos: { id: number; nombre: string }[];
}

type TipoNotificacionFormato32 = 'individual' | 'grupal' | '';
type MedioNotificacionFormato32 = 'whatsapp' | 'email' | 'telefono' | 'plataforma';

interface OpcionMedioFormato32 {
  valor: MedioNotificacionFormato32;
  etiqueta: string;
}

interface NotificacionFormato32 {
  fechaNotificacion: string;
  tipoNotificacion: TipoNotificacionFormato32;
  nombres: string;
  apellidos: string;
  mediosNotificacion: MedioNotificacionFormato32[];
  detalle: string;
}

@Component({
  selector: 'app-formatotreintaydos',
  templateUrl: './formatotreintaydos.component.html',
  styleUrls: ['./formatotreintaydos.component.css']
})
export class FormatotreintaydosComponent implements OnInit {
  usuarios: UsuarioFormato32[] = [];
  cursos: CursoFormato32[] = [];
  instructorIdentificacion = '';
  formato6Codigo: number | null = null;
  formato6ModuloId: number | null = null;
  observaciones = '';
  notificaciones: NotificacionFormato32[] = [this.nuevaNotificacion()];
  readonly opcionesMedio: OpcionMedioFormato32[] = [
    { valor: 'whatsapp', etiqueta: 'WhatsApp' },
    { valor: 'email', etiqueta: 'Email' },
    { valor: 'telefono', etiqueta: 'Teléfono' },
    { valor: 'plataforma', etiqueta: 'Plataforma' }
  ];
  detalle = '';
  guardando = false;

  constructor(
    private modulosService: ModulosService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCursos();
  }

  private nuevaNotificacion(): NotificacionFormato32 {
    return {
      fechaNotificacion: '',
      tipoNotificacion: '',
      nombres: '',
      apellidos: '',
      mediosNotificacion: [],
      detalle: ''
    };
  }

  get modulosDisponibles(): { id: number; nombre: string }[] {
    return this.cursos.find((curso) => Number(curso.formato6_codigo) === Number(this.formato6Codigo))?.modulos || [];
  }

  agregarNotificacion(): void {
    this.notificaciones.push(this.nuevaNotificacion());
  }

  quitarNotificacion(indice: number): void {
    if (this.notificaciones.length > 1) {
      this.notificaciones.splice(indice, 1);
    }
  }

  cambiarTipoNotificacion(
    notificacion: NotificacionFormato32,
    tipo: Exclude<TipoNotificacionFormato32, ''>,
    evento: Event
  ): void {
    const elemento = evento.target;
    if (!(elemento instanceof HTMLInputElement)) {
      return;
    }

    notificacion.tipoNotificacion = elemento.checked ? tipo : '';
    if (notificacion.tipoNotificacion !== 'individual') {
      notificacion.nombres = '';
      notificacion.apellidos = '';
    }
  }

  alternarMedio(notificacion: NotificacionFormato32, medio: MedioNotificacionFormato32, evento: Event): void {
    const elemento = evento.target;
    if (!(elemento instanceof HTMLInputElement)) {
      return;
    }

    notificacion.mediosNotificacion = elemento.checked
      ? [...notificacion.mediosNotificacion, medio]
      : notificacion.mediosNotificacion.filter((seleccionado) => seleccionado !== medio);
  }

  private cargarUsuarios(): void {
    this.modulosService.obtenerUsuariosFormato32({ fx: 'getusuariosformato32', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.usuarios = respuesta?.data?.success && Array.isArray(respuesta.data.item)
          ? respuesta.data.item
          : [];
        if (this.usuarios.length === 0) {
          Swal.fire('Aviso', 'No hay usuarios activos disponibles para seleccionar.', 'info');
        }
      },
      error: () => {
        this.usuarios = [];
        Swal.fire('Error', 'No se pudieron cargar los instructores-gestores.', 'error');
      }
    });
  }

  private cargarCursos(): void {
    this.modulosService.obtenerFormato6({ fx: 'getformato6', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cursos = respuesta?.data?.success && Array.isArray(respuesta.data.item)
          ? respuesta.data.item.filter((curso: CursoFormato32) =>
            !!curso.formato1_curso_definido?.trim() && Array.isArray(curso.modulos) && curso.modulos.length > 0)
          : [];
        if (this.cursos.length === 0) {
          Swal.fire('Aviso', 'No hay cursos definidos activos disponibles para seleccionar.', 'info');
        }
      },
      error: () => {
        this.cursos = [];
        Swal.fire('Error', 'No se pudieron cargar los cursos definidos.', 'error');
      }
    });
  }

  guardar(formulario: NgForm): void {
    if (this.guardando) {
      return;
    }

    if (formulario.invalid || !this.formato6ModuloId) {
      formulario.control.markAllAsTouched();
      Swal.fire('Datos incompletos', 'Selecciona el curso y módulo del Formato 6 y completa los campos obligatorios.', 'warning');
      return;
    }

    for (let indice = 0; indice < this.notificaciones.length; indice += 1) {
      const notificacion = this.notificaciones[indice];
      if (!notificacion.tipoNotificacion) {
        Swal.fire('Datos incompletos', `Selecciona si la notificación ${indice + 1} es individual o grupal.`, 'warning');
        return;
      }
      if (notificacion.mediosNotificacion.length === 0) {
        Swal.fire('Datos incompletos', `Selecciona al menos un medio para la notificación ${indice + 1}.`, 'warning');
        return;
      }
    }

    this.guardando = true;
    this.modulosService.insertarFormato32({
      fx: 'insertformato32',
      d: {
        instructorIdentificacion: this.instructorIdentificacion,
        formato6Codigo: this.formato6Codigo,
        formato6ModuloId: this.formato6ModuloId,
        observaciones: this.observaciones.trim(),
        notificaciones: this.notificaciones.map((notificacion) => ({
          ...notificacion,
          nombres: notificacion.tipoNotificacion === 'individual' ? notificacion.nombres.trim() : '',
          apellidos: notificacion.tipoNotificacion === 'individual' ? notificacion.apellidos.trim() : '',
          detalle: notificacion.detalle.trim()
        }))
      }
    }).subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (respuesta?.data?.success) {
          Swal.fire('Guardado', respuesta.data.message || 'El Formato 32 se guardó correctamente.', 'success')
            .then(() => {
              this.instructorIdentificacion = '';
              this.formato6Codigo = null;
              this.formato6ModuloId = null;
              this.observaciones = '';
              this.notificaciones = [this.nuevaNotificacion()];
              formulario.resetForm();
            });
          return;
        }
        Swal.fire('Error', respuesta?.data?.message || 'No se pudo guardar el Formato 32.', 'error');
      },
      error: () => {
        this.guardando = false;
        Swal.fire('Error', 'No se pudo guardar el Formato 32.', 'error');
      }
    });
  }
}
