import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../servicios/modulos.service';
import Swal from 'sweetalert2';

interface DatosFormato5 {
  formato6Codigo: number | null;
  cedula: string;
  nombres: string;
  apellidos: string;
  dominioTematica: number | null;
  dominioAula: number | null;
  habilidadesBlandas: number | null;
  notaEntrevista: number | null;
  observaciones: string;
}

@Component({
  selector: 'app-formatocinco',
  templateUrl: './formatocinco.component.html',
  styleUrls: ['./formatocinco.component.css']
})
export class FormatocincoComponent implements OnInit {
  cursos: any[] = [];
  guardando = false;
  datos: DatosFormato5 = this.nuevoFormulario();

  constructor(private modulosService: ModulosService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  private nuevoFormulario(): DatosFormato5 {
    return {
      formato6Codigo: null,
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

  cargarCursos(): void {
    this.modulosService.obtenerFormato6({ fx: 'getformato6', d: {} }).subscribe({
      next: (respuesta: any) => {
        this.cursos = respuesta?.data?.success && Array.isArray(respuesta.data.item)
          ? respuesta.data.item.filter((curso: any) => !!curso.formato1_curso_definido?.trim())
          : [];
      },
      error: () => {
        this.cursos = [];
        Swal.fire('Error', 'No se pudieron cargar los cursos definidos.', 'error');
      }
    });
  }

  guardar(formulario: any): void {
    if (this.guardando) {
      return;
    }

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      Swal.fire('Datos incompletos', 'Completa los campos obligatorios antes de guardar el Formato 5.', 'warning');
      return;
    }

    this.guardando = true;
    this.modulosService.insertarFormato5({ fx: 'insertformato5', d: this.datos }).subscribe({
      next: (respuesta: any) => {
        this.guardando = false;
        if (respuesta?.data?.success) {
          Swal.fire('Guardado', 'El Formato 5 se guardó correctamente.', 'success');
          this.datos = this.nuevoFormulario();
          formulario.resetForm(this.datos);
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