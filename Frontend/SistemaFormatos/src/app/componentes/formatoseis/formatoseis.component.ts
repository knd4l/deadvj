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
    formato6Codigo:number=0;
    cursoNombre: string = '';

      // FORMATOS 1 CON CURSO DEFINIDO

    formatos1Definidos: any[] = [];
    formato1Seleccionado: any = null;

    formato6Existe: boolean = false;



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

guardarFormato6(): void {

  // =====================================================
  // SI YA EXISTE → ACTUALIZAR
  // =====================================================

  if (this.formato6Existe) {

    const objetoopciones = {

      fx: 'updateformato6',

      d: {
        formato6_codigo: this.formato6Codigo,
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
    this.formato6Existe = true;

    console.log(
      'Actualizando Formato 6:',
      objetoopciones
    );

    this.miServicio.updateformato6(
      objetoopciones
    ).subscribe({

      next: (respuesta: any) => {

        console.log(
          'Respuesta actualización:',
          respuesta
        );

        if (
          respuesta &&
          respuesta.data &&
          respuesta.data.success
        ) {

          Swal.fire({
            icon: 'success',
            title: 'Actualizado correctamente',
            text: respuesta.data.message
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              respuesta?.data?.message ||
              'No se pudo actualizar el Formato 6.'
          });

        }

      },

      error: (error) => {

        console.error(
          'Error al actualizar Formato 6:',
          error
        );

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el Formato 6.'
        });

      }

    });

    return;
  }


  // =====================================================
  // SI NO EXISTE → GUARDAR NUEVO
  // =====================================================

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
    'Guardando nuevo Formato 6:',
    objetoopciones
  );

  this.miServicio.insertformato6(
    objetoopciones
  ).subscribe({

    next: (respuesta: any) => {

      console.log(
        'Respuesta del servidor:',
        respuesta
      );

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

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            respuesta?.data?.message ||
            'No se pudo guardar el Formato 6.'
        });

      }

    },

    error: (error) => {

      console.error(
        'Error al guardar Formato 6:',
        error
      );

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

         // DESPUÉS DE CARGAR FORMATO 1,
        // BUSCAR SI YA EXISTE UN FORMATO 6
          this.cargarFormato6Existente(codigo);

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
// CARGAR FORMATO 6 EXISTENTE
// =====================================================
cargarFormato6Existente(codigo: number): void {

  const objetoopciones = {
    fx: 'getformato6PorFormato1',
    d: {
      formato1_codigo: codigo
    },
    dpro: 0,
    dus: 0,
    dcx: 1
  };

  console.log(
    'Buscando Formato 6 para Formato 1:',
    codigo
  );

  this.miServicio.obtenerFormato6PorFormato1(
    objetoopciones
  ).subscribe({

    next: (respuesta: any) => {

      console.log(
        'Respuesta Formato 6 existente:',
        respuesta
      );

      // =====================================================
      // SI EXISTE FORMATO 6
      // =====================================================

      if (
        respuesta &&
        respuesta.data &&
        respuesta.data.success &&
        respuesta.data.item &&
        respuesta.data.item.length > 0
      ) {

        const datos = respuesta.data.item[0];

        // =====================================================<f
        // GUARDAR CÓDIGO DEL FORMATO 6 EXISTENTE
        // =====================================================

                  // INDICA QUE YA EXISTE
      
        this.formato6Codigo =Number(datos.formato6_codigo);  
        this.formato6Existe = true;

          console.log('Existe Formato 6. Se podrá actualizar.');


        // =====================================================
        // CARGAR TODOS LOS DATOS DEL FORMATO 6
        // =====================================================

        this.formato6.fechaElaboracion =
          datos.formato6_fecha_elaboracion || '';

        this.formato6.requerimiento =
          datos.formato6_requerimiento || '';

        this.formato6.unidadResponsable =
          datos.formato6_unidad_responsable || '';

        this.formato6.instructores =
          datos.formato6_instructores || '';

        this.formato6.beneficiarios =
          datos.formato6_beneficiarios || '';

        this.formato6.paralelo =
          datos.formato6_paralelo || '';

        this.formato6.modalidad =
          datos.formato6_modalidad || '';

        this.formato6.area =
          datos.formato6_area || '';

        this.formato6.cargaHoraria =
          datos.formato6_carga_horaria || '';

        this.formato6.periodos =
          datos.formato6_periodos || '';

        this.formato6.horario =
          datos.formato6_horario || '';

        this.formato6.lugar =
          datos.formato6_lugar || '';

        this.formato6.prerrequisitos =
          datos.formato6_prerrequisitos || '';

        this.formato6.tipoCertificado =
          datos.formato6_tipo_certificado || '';

        this.formato6.inversion =
          datos.formato6_inversion || '';

          this.formato6Existe = true;

        console.log('Formato 6 cargado completamente:',this.formato6);
        console.log('formato6Existe:', this.formato6Existe);
        console.log('formato6Codigo:', this.formato6Codigo);

      } else {

       this.formato6Existe = false;
        this.formato6Codigo = 0;

      console.log('NO EXISTE FORMATO 6');
      }

    },

    error: (error) => {

      console.error(
        'Error al buscar Formato 6 existente:',
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
    this.formato6Existe = false;
    this.formato6Codigo = 0;
    return;
  }

  console.log('FORMATO 1 SELECCIONADO:', this.formato1Seleccionado);

  this.formato1Codigo =
    Number(this.formato1Seleccionado.formato1_codigo);

  this.cursoNombre =
    this.formato1Seleccionado.formato1_curso_definido;

  // CAMBIO: reiniciar estado antes de consultar
  this.formato6Existe = false;
  this.formato6Codigo = 0;

  console.log('Estado reiniciado:');
  console.log('formato6Existe:', this.formato6Existe);
  console.log('formato6Codigo:', this.formato6Codigo);

  this.cargarDatosFormato1(this.formato1Codigo);

}
}
