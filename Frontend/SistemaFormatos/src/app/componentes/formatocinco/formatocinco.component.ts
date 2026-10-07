import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface ParticipanteFormato5 {
  formato5Codigo?: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  dominioTematica: number | null;
  dominioAula: number | null;
  habilidadesBlandas: number | null;
  notaEntrevista: number | null;
  observaciones: string;
}

interface UsuarioFormato5 {
  cedula: string;
  nombres: string;
  apellidos: string;
}

@Component({
  selector: 'app-formatocinco',
  templateUrl: './formatocinco.component.html',
  styleUrls: ['./formatocinco.component.css']
})
export class FormatocincoComponent implements OnInit {
  cursos: any[] = [];
  usuarios: UsuarioFormato5[] = [];
  guardando = false;
  editando = false;
  formato6Codigo: number | null = null;
  formato6ModuloId: number | null = null;
  participantes: ParticipanteFormato5[] = [this.nuevoParticipante()];

  constructor(
    private modulosService: ModulosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarUsuarios();
    this.route.queryParamMap.subscribe((params) => {
      const codigo = Number(params.get('editar'));
      if (Number.isInteger(codigo) && codigo > 0) {
        this.cargarEntrevistaParaEditar(codigo);
      } else {
        this.editando = false;
      }
    });
  }

  private nuevoParticipante(): ParticipanteFormato5 {
    return {
      cedula: '',
      nombres: '',
      apellidos: '',
      dominioTematica: null,
      dominioAula: null,
      habilidadesBlandas: null,
      notaEntrevista: null,
      observaciones: ''
    };
  }

  usuariosDisponiblesPara(participanteActual: ParticipanteFormato5): UsuarioFormato5[] {
    const cedulasSeleccionadas = new Set(
      this.participantes
        .filter((participante) => participante !== participanteActual)
        .map((participante) => participante.cedula.trim())
        .filter(Boolean)
    );
    return this.usuarios.filter((usuario) =>
      !cedulasSeleccionadas.has(usuario.cedula) || usuario.cedula === participanteActual.cedula
    );
  }

  actualizarNotaEntrevista(participante: ParticipanteFormato5): void {
    const notas = [
      participante.dominioTematica,
      participante.dominioAula,
      participante.habilidadesBlandas
    ];
    participante.notaEntrevista = notas.every((nota) => nota !== null && nota !== undefined)
      ? notas.reduce<number>((suma, nota) => suma + Number(nota), 0) / 3
      : null;
  }

  private cargarEntrevistaParaEditar(codigo: number): void {
    this.modulosService.obtenerFormatos5({ fx: 'getformato5', d: {} }).subscribe({
      next: (respuesta: any) => {
        const entrevista = respuesta?.data?.success && Array.isArray(respuesta.data.item)
          ? respuesta.data.item.find((registro: any) => Number(registro.formato5_codigo) === codigo)
          : null;

        if (!entrevista) {
          this.editando = false;
          Swal.fire('Error', 'No se encontró la entrevista que deseas editar.', 'error');
          return;
        }

        this.editando = true;
        this.formato6Codigo = Number(entrevista.formato6_codigo);
        this.formato6ModuloId = Number(entrevista.formato5_modulo_id) || null;
        this.participantes = [{
          formato5Codigo: Number(entrevista.formato5_codigo),
          cedula: entrevista.formato5_cedula || '',
          nombres: entrevista.formato5_nombres || '',
          apellidos: entrevista.formato5_apellidos || '',
          dominioTematica: Number(entrevista.formato5_dominio_tematica),
          dominioAula: Number(entrevista.formato5_dominio_aula),
          habilidadesBlandas: Number(entrevista.formato5_habilidades_blandas),
          notaEntrevista: Number(entrevista.formato5_nota_entrevista),
          observaciones: entrevista.formato5_observaciones || ''
        }];
      },
      error: () => {
        this.editando = false;
        Swal.fire('Error', 'No se pudo cargar la entrevista para editar.', 'error');
      }
    });
  }

  agregarParticipante(): void {
    this.participantes.push(this.nuevoParticipante());
  }

  quitarParticipante(indice: number): void {
    if (this.participantes.length > 1) {
      this.participantes.splice(indice, 1);
    }
  }

  seleccionarUsuario(participante: ParticipanteFormato5): void {
    const cedula = participante.cedula.trim();
    const yaSeleccionada = this.participantes.some((otra) =>
      otra !== participante && otra.cedula.trim() === cedula
    );
    if (cedula && yaSeleccionada) {
      participante.cedula = '';
      participante.nombres = '';
      participante.apellidos = '';
      Swal.fire('Cédula duplicada', 'Cada entrevista debe tener una cédula distinta.', 'warning');
      return;
    }

    const usuario = this.usuarios.find((item) => item.cedula === cedula);
    participante.nombres = usuario?.nombres || '';
    participante.apellidos = usuario?.apellidos || '';
  }

  cargarCursos(): void {
    this.modulosService.obtenerFormato6({ fx: 'getformato6', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cursos = respuesta?.data?.success && Array.isArray(respuesta.data.item)
          ? respuesta.data.item.filter((curso: any) =>
            !!curso.formato1_curso_definido?.trim() && Array.isArray(curso.modulos) && curso.modulos.length > 0)
          : [];
      },
      error: () => {
        this.cursos = [];
        Swal.fire('Error', 'No se pudieron cargar los cursos definidos.', 'error');
      }
    });
  }

  get modulosDisponibles(): any[] {
    return this.cursos.find((curso) => Number(curso.formato6_codigo) === Number(this.formato6Codigo))?.modulos || [];
  }

  cargarUsuarios(): void {
    this.modulosService.obtenerUsuariosFormato5({ fx: 'getusuariosformato5', d: {} }).subscribe({
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
        Swal.fire('Error', 'No se pudieron cargar las cédulas de usuarios.', 'error');
      }
    });
  }

  guardar(formulario: any): void {
    if (this.guardando) {
      return;
    }

    if (formulario.invalid || !this.formato6ModuloId) {
      formulario.control.markAllAsTouched();
      Swal.fire('Datos incompletos', 'Selecciona el curso y módulo del Formato 6 y completa los campos obligatorios.', 'warning');
      return;
    }

    const cedulas = this.participantes.map((participante) => participante.cedula.trim());
    if (new Set(cedulas).size !== cedulas.length) {
      Swal.fire('Cédula duplicada', 'Cada entrevista debe tener una cédula distinta.', 'warning');
      return;
    }

    this.guardando = true;
    this.modulosService.insertarFormato5({
      fx: 'insertformato5',
      d: {
        formato6Codigo: this.formato6Codigo,
        formato6ModuloId: this.formato6ModuloId,
        participantes: this.participantes
      }
    }).subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (respuesta?.data?.success) {
        if (this.editando) {
          Swal.fire('Actualizado', 'La entrevista se actualizó correctamente.', 'success')
            .then(() => this.router.navigate(['/verformatocinco']));
          return;
        }
        Swal.fire('Guardado', respuesta.data.message || 'Las entrevistas anteriores del módulo se reemplazaron correctamente.', 'success');
        this.formato6Codigo = null;
        this.formato6ModuloId = null;
        this.participantes = [this.nuevoParticipante()];
        formulario.resetForm();
        } else {
          Swal.fire('Error', respuesta?.data?.message || 'No se pudo guardar el Formato 5.', 'error');
        }
      },
      error: () => {
        this.guardando = false;
        Swal.fire('Error', 'No se pudo guardar el Formato 5.', 'error');
      }
    });
  }
}