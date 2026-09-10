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


    formato1Codigo:number=0; //Recupera el numero del formato 1
    formato6Codigo:number=0;
    cursoNombre: string = ''; //Se almacenara el nombre del curso

      // FORMATOS 1 CON CURSO DEFINIDO

    formatos1Definidos: any[] = [];
    formato1Seleccionado: any = null;

    formato6Existe: boolean = false;//Para cambiar de boton a actualizar
    moduloActual: number = 1; //Para ver en que pestaña estamos

    diasSemana: string[]=[
       'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo'
    ];







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
    }

    //Recuperamos el codigo del formato 1

    const codigoGuardado=sessionStorage.getItem('formato1_codigo_formato6');
    
    if (codigoGuardado) { 

      this.formato1Codigo = Number(codigoGuardado);

       console.log( 'Código del Formato 1 recuperado:', this.formato1Codigo );

       //Volvemos a cargar los datos del formato 1

       this.cargarDatosFormato1(this.formato1Codigo);

    }else{
      console.log( 'No existe un código de Formato 1 guardado' );
    }

    this.cargarFormatos1Definidos();
    //Recuperamos el id del formato 1

  }

  // =====================================================
// CARGAR FORMATOS 1 CON CURSO DEFINIDO
// =====================================================

siguienteModulo(): void {
  if (this.moduloActual < 5) {
    this.moduloActual++;
  }
}

moduloAnterior(): void {
  if (this.moduloActual > 1) {
    this.moduloActual--;
  }
}
agregarFilaCronograma(): void {
  this.formato6.cronograma.push({
    horario: '',
    fechas: '',
    totalHoras: ''
  });
}

calcularTotalIngresos(): void {

  const total = this.formato6.presupuesto.ingresos.reduce(
    (suma: number, ingreso: any) => {

      return suma + (Number(ingreso.total) || 0);

    },
    0
  );

  this.formato6.presupuesto.totalIngresos =
    String(total);

}



recalcularIngresos(): void {

  this.formato6.presupuesto.ingresos.forEach(
    (ingreso: any) => {

      const participantes =
        Number(this.formato6.presupuesto.participantes) || 0;

      const valor =
        Number(ingreso.valor) || 0;

      ingreso.total =
        String(participantes * valor);

    }
  );

  this.calcularTotalIngresos();

}

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

    //Modulo 1  
    fechaElaboracion: '',
    requerimiento: '',
    unidadResponsable: '',
    instructores: '',
    beneficiarios: '',
    paralelo: '',
    modalidad: '',
    area: '',
    cargaHoraria: '',
    periodos:{
      matriculaDesde:'',
      matriculaHasta:'',
      ejecucionDesde:'',
      ejecucionHasta:'',
      ejecucion:'',

      modulos:[
        {
          nombre:'',
          desde:'',
          hasta:''
        }
      ]
    },
    
    horario:[
      {
        tipo:'Clases en vivo (sincrónico)',
        dias:[] as string[],
        horaDesde:'',
        horaHasta:''
      }
    ],
    lugar: '',
    prerrequisitos: '',
    tipoCertificado: '',
    inversion: '',


    //Modulo 2
    introduccion: 'La educación superior se encuentra en un proceso de transformación profunda impulsada por los avances tecnológicos y las demandas de un mundo globalizado. En este contexto, la Educación 4.0 surge como un modelo innovador que integra tecnologías emergentes, como la inteligencia artificial (IA), para responder a los desafíos educativos del siglo XXI.'+"\n\n"+'Este curso ofrece un enfoque integral que combina fundamentos pedagógicos contemporáneos con el uso práctico de soluciones basadas en IA, a través de dos módulos, cada participante explorará cómo la inteligencia artificial puede personalizar los procesos educativos, optimizar la gestión académica y mejorar la experiencia de aprendizaje de los estudiantes; abordando temas clave como el diseño de entornos virtuales de aprendizaje, el uso de plataformas adaptativas, analítica de datos educativos y automatización de procesos de evaluación.'+"\n\n"+'Así mismo, el curso promueve la reflexión crítica sobre el impacto ético y social de la incorporación de la IA en la educación, fomentando el desarrollo de competencias digitales, pensamiento crítico e innovación pedagógica, de esta los participantes serán guiados para crear experiencias de aprendizaje dinámicas, inclusivas y adaptadas a las necesidades de los estudiantes actuales, preparándolos para enfrentar los retos de un entorno educativo en constante evolución. ',

    justificacion: 'La rápida evolución tecnológica y la creciente demanda de innovación educativa requieren que los docentes universitarios se mantengan actualizados y desarrollen competencias digitales avanzadas, en este curso se responde a la necesidad de formación especializada en el uso de inteligencia artificial y tecnologías emergentes aplicadas a la docencia y su implementación en el aula. '+"\n\n"+'La participación en este evento de educación continua fortalece el perfil profesional de los docentes, al dotarlos de herramientas y estrategias que mejoran la calidad de la enseñanza y optimizan los procesos académicos, llevándolos a una integración de soluciones basadas en IA que permite a los educadores diseñar experiencias de aprendizaje mas personalizadas, inclusivas y eficientes, favoreciendo tanto la motivación, el rendimiento de los estudiantes, el pensamiento crítico, la innovación pedagógica, habilidades fundamentales para adaptarse a los constantes cambios del entorno educativo, entre otros. '+"\n\n"+'De esta manera, el curso no solo contribuye al desarrollo de competencias técnicas y pedagógicas, sino que también posiciona a los docentes como agentes de cambio capaces de impulsar la evolución de la educación superior, elevando su competitividad y proyección profesional en un mercado académico global. ',

    //Modulo 3
    objetivos:{
      general:'',
      especificos:[
        ''
      ]
    },
    metodologiaCurso: '',
    planificacionContenidos: '',

    //Modulo 4
    evaluacion:'',
    acreditacionCalificacion:'',
    cronograma:[
      {
        horario: '',
        fechas: '',
        totalHoras: '',
      }
    ],

    //Modulo 5
    presupuesto:{
      participantes:'',
      paralelo:'',
      ingresos:[{
        descripcion:'',
        valor:'',
        total:''
      }],
      totalIngresos:''
    }

  };

agregarObjetivoEspecifico(): void {
  this.formato6.objetivos.especificos.push('');
}

eliminarObjetivoEspecifico(index: number): void {
  this.formato6.objetivos.especificos.splice(index, 1);
}

  //Agrega el modulo en el campo periodo
  agregarModulo(): void {

  this.formato6.periodos.modulos.push({
    nombre: '',
    desde: '',
    hasta: ''
  });

}

//Elimina el modulo que ya no necesite
eliminarModulo(index: number): void {

  this.formato6.periodos.modulos.splice(index, 1);

}
agregarHorario(): void {

  this.formato6.horario.push({
    tipo: 'Clases en vivo (sincrónico)',
    dias: [],
    horaDesde: '',
    horaHasta: ''
  });

}

eliminarHorario(index: number): void {

  this.formato6.horario.splice(index, 1);

}

cambiarDia(
  horario: any,
  dia: string,
  event: any
): void {

  if (event.target.checked) {

    horario.dias.push(dia);

  } else {

    horario.dias = horario.dias.filter(
      (d: string) => d !== dia
    );

  }

}


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

          //Para obtener fechas seleccionadas del formato 1
          const desde = datos.formato1_fecha_ejecucion_desde;
          const hasta = datos.formato1_fecha_ejecucion_hasta;

          console.log('Registro del Formato 1:',datos);
          
          console.log('Campos recibidos',Object.keys(datos));


          // =====================================================
          // PASAR DATOS DEL FORMATO 1 AL FORMATO 6
          // =====================================================

          this.formato6.fechaElaboracion =
            datos.formato1_fecha_elaboracion || '';

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


          //Guardar fechas individuales
          this.formato6.periodos.ejecucionDesde=desde|| '';

          this.formato6.periodos.ejecucionHasta= hasta || '';

          // ===================================================== 
          // CREAR TEXTO CON EL RANGO SELECCIONADO 
          // =====================================================

          if (desde && hasta) { 
            this.formato6.periodos.ejecucion = 
            this.formatearFecha(desde,hasta) 
          } else { 
            this.formato6.periodos.ejecucion = ''; }

            console.log(
            'EJECUCIÓN FORMATO 6:',
            this.formato6.periodos.ejecucion
          );


          // =====================================================
          // MOSTRAR RESULTADO EN CONSOLA
          // =====================================================

          console.log('Datos cargados en Formato 6:',this.formato6);

          console.log('CURSO ANTES DE CARGAR FORMATO 6:',this.cursoNombre);

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

//Funcion para describir la fecha en texto
formatearFecha(desde: string, hasta: string): string {

  if (!desde || !hasta) {
    return '';
  }

  const [anioDesde, mesDesde, diaDesde] = desde.split('-');
   const [anioHasta, mesHasta, diaHasta] = hasta.split('-');

  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ];

 return `${diaDesde} de ${meses[Number(mesDesde) - 1]} al ${diaHasta} de ${meses[Number(mesHasta) - 1]} del ${anioHasta}`;
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
          datos.formato6_periodos?JSON.parse(datos.formato6_periodos):{
            inscripcionDesde: '',
            inscripcionHasta: '',
            matriculaDesde: '',
            matriculaHasta: '',
            ejecucionDesde: '',
            ejecucionHasta: '',
            ejecucion: '',
            modulos: []
          };

        this.formato6.horario =
          datos.formato6_horario?JSON.parse(datos.formato6_horario):[
            {
              tipo: 'Clases en vivo (sincrónico)',
              dias: [],
              horaDesde: '',
              horaHasta: '' 
            }
          ]

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

    // Limpiamos los datos guardados
    sessionStorage.removeItem('formato1_codigo_formato6');
    sessionStorage.removeItem('cursoFormato6');
    return;
  }

  console.log('FORMATO 1 SELECCIONADO:', this.formato1Seleccionado);

  //Guardamos el codigo del formato 1
  this.formato1Codigo =
    Number(this.formato1Seleccionado.formato1_codigo);

     sessionStorage.setItem(
    'formato1_codigo_formato6',
    String(this.formato1Codigo)
  );

  //Guardamos el nombre del curso

  this.cursoNombre =this.formato1Seleccionado.formato1_curso_definido;

    sessionStorage.setItem(
    'cursoFormato6',
    this.cursoNombre
  );

  console.log('CURSO NOMBRE:', this.cursoNombre);

   console.log(
    'CÓDIGO FORMATO 1 GUARDADO:',
    this.formato1Codigo
  );

  // CAMBIO: reiniciar estado antes de consultar
  this.formato6Existe = false;
  this.formato6Codigo = 0;

  console.log('Estado reiniciado:');
  console.log('formato6Existe:', this.formato6Existe);
  console.log('formato6Codigo:', this.formato6Codigo);

  this.cargarDatosFormato1(this.formato1Codigo);

}
}
