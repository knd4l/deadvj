import { Component, OnInit } from '@angular/core';
import { ModulosService } from 'src/app/servicios/modulos.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-formatoseis',
  templateUrl: './formatoseis.component.html',
  styleUrls: ['./formatoseis.component.css']
})
export class FormatoseisComponent implements OnInit {


    formato1Codigo:number=0;
    cursoNombre: string = '';

      // FORMATOS 1 CON CURSO DEFINIDO

    formatos1Definidos: any[] = [];
    formato1Seleccionado: any = null;


  constructor(
    private miServicio: ModulosService
  ) { 

  }

  ngOnInit(): void {

    // Recuperamos el curso guardado desde Formato 1
    const curso = sessionStorage.getItem('cursoFormato6');

    if (curso) {
      this.cursoNombre = curso;

      console.log('Curso recibido en Formato 6:',
        this.cursoNombre);
    }else{
      console.log(
        'No existe un curso guardado para el Formato 6'
      );
    }

    this.cargarFormatos1Definidos();
    //Recuperamos el id del formato 1

  }

  // =====================================================
// CARGAR FORMATOS 1 CON CURSO DEFINIDO
// =====================================================

cargarFormatos1Definidos(): void {

  const objetoopciones = {

    fx: 'getformato1CursoDefinido',

    d: {},

    dpro: 0,

    dus: 0,

    dcx: 1

  };

  console.log(
    'Consultando Formatos 1 con curso definido:',
    objetoopciones
  );

  this.miServicio.obtenerFormato1CursoDefinido(
    objetoopciones
  )
  .subscribe({

    next: (respuesta: any) => {

      console.log(
        'Formatos 1 con curso definido:',
        respuesta
      );

      if (
        respuesta &&
        respuesta.data &&
        respuesta.data.success &&
        Array.isArray(respuesta.data.item)
      ) {

        this.formatos1Definidos =
          respuesta.data.item;

        console.log(
          'TOTAL FORMATOS 1 DISPONIBLES:',
          this.formatos1Definidos.length
        );

      } else {

        this.formatos1Definidos = [];

        console.warn(
          'No existen Formatos 1 con curso definido.'
        );

      }

    },

    error: (error) => {

      console.error(
        'Error al cargar Formatos 1 definidos:',
        error
      );

      this.formatos1Definidos = [];

    }

  });

}

 // =====================================================
  // DATOS DEL FORMATO 6
  // =====================================================

  formato6 = {

    fechaElaboracion: '',
    requerimiento: '',
    unidadResponsable: '',
    instructores: '',
    beneficiarios: '',
    paralelo: '',
    modalidad: '',
    area: '',
    cargaHoraria: '',
    periodos: '',
    horario: '',
    lugar: '',
    prerrequisitos: '',
    tipoCertificado: '',
    inversion: ''

  };

// =====================================================
// GUARDAR FORMATO 6
// =====================================================

guardarFormato6() {

  const objetoopciones = {

    fx: 'insertformato6',

    d: {
      formato1_codigo: this.formato1Codigo,

      fechaElaboracion: this.formato6.fechaElaboracion,
      requerimiento: this.formato6.requerimiento,
      unidadResponsable: this.formato6.unidadResponsable,
      instructores: this.formato6.instructores,
      beneficiarios: this.formato6.beneficiarios,
      paralelo: this.formato6.paralelo,
      modalidad: this.formato6.modalidad,
      area: this.formato6.area,
      cargaHoraria: this.formato6.cargaHoraria,
      periodos: this.formato6.periodos,
      horario: this.formato6.horario,
      lugar: this.formato6.lugar,
      prerrequisitos: this.formato6.prerrequisitos,
      tipoCertificado: this.formato6.tipoCertificado,
      inversion: this.formato6.inversion
    }

  };

  console.log(
    'Datos enviados para Formato 6:',
    objetoopciones
  );

  this.miServicio.insertformato6(
    objetoopciones
  )
  .subscribe({

    next: (respuesta: any) => {

      console.log(
        'Respuesta del servidor:',
        respuesta
      );

      // =====================================================
      // GUARDADO CORRECTO
      // =====================================================

      if (
        respuesta &&
        respuesta.data &&
        respuesta.data.success
      ) {

        Swal.fire({
          icon: 'success',
          title: 'Guardado correctamente',
          text: respuesta.data.message
        });

      } else {

        // =====================================================
        // ERROR AL GUARDAR
        // =====================================================

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: respuesta?.data?.message ||
                'No se pudo guardar el Formato 6.'
        });

      }

    },

    error: (error) => {

      console.error(
        'Error al guardar Formato 6:',
        error
      );

      // =====================================================
      // ERROR DE CONEXIÓN / SERVIDOR
      // =====================================================

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el Formato 6.'
      });

    }

  });

}

  cargarDatosFormato1(codigo: number) {

  this.miServicio.obtenerDatosFormato1(codigo)
    .subscribe({

      next: (respuesta: any) => {

        console.log(
          'Datos del Formato 1:',
          respuesta
        );

        // =====================================================
        // VERIFICAR QUE EXISTAN DATOS
        // =====================================================

        if (
          respuesta &&
          respuesta.data &&
          respuesta.data.success &&
          respuesta.data.item &&
          respuesta.data.item.length > 0
        ) {

          // =====================================================
          // OBTENER EL PRIMER REGISTRO
          // =====================================================

          const datos = respuesta.data.item[0];

          console.log(
            'Registro del Formato 1:',
            datos
          );

          // =====================================================
          // PASAR DATOS DEL FORMATO 1 AL FORMATO 6
          // =====================================================

          this.formato6.fechaElaboracion =
            datos.formato1_fecha_ejecucion || '';

          this.formato6.requerimiento =
            datos.tipo_capac_nombre || '';

          this.formato6.instructores =
            datos.instructores_tentativos || '';

          this.formato6.modalidad =
            datos.modalidad_nombre || '';

          this.formato6.cargaHoraria =
            datos.formato1_carga_horaria || '';

          this.formato6.inversion =
            datos.formato1_inversion || '';


          // =====================================================
          // MOSTRAR RESULTADO EN CONSOLA
          // =====================================================

          console.log(
            'Datos cargados en Formato 6:',
            this.formato6
          );

        } else {

          console.warn(
            'No se encontraron datos para el Formato 1:',
            codigo
          );

        }

      },

      error: (error) => {

        console.error(
          'Error al obtener Formato 1:',
          error
        );

      }

    });

}

// =====================================================
// SELECCIONAR FORMATO 1
// =====================================================

seleccionarFormato1(): void {

  if (!this.formato1Seleccionado) {

    this.formato1Codigo = 0;
    this.cursoNombre = '';

    return;
  }

  console.log(
    'FORMATO 1 SELECCIONADO:',
    this.formato1Seleccionado
  );

  // =====================================================
  // GUARDAR CÓDIGO DEL FORMATO 1
  // =====================================================

  this.formato1Codigo =
    Number(
      this.formato1Seleccionado.formato1_codigo
    );

  // =====================================================
  // MOSTRAR NOMBRE DEL CURSO
  // =====================================================

  this.cursoNombre =
    this.formato1Seleccionado.formato1_curso_definido;

  // =====================================================
  // CARGAR DATOS COMPLETOS DEL FORMATO 1
  // =====================================================

  this.cargarDatosFormato1(
    this.formato1Codigo
  );

}
}
