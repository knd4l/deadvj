import { Component, OnInit } from '@angular/core';
import { ModulosService } from 'src/app/servicios/modulos.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface HorarioModulo{
  tipo:string;
  dias:string[];
  horaDesde:string;
  horaHasta:string;
}

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

      presupuesto: any = [
        {
          partida: 1,
          numeroInstructores: 1,
          valor: 0,
          total: 0,
          descripcion: ''
        }
      ]
      
    


    modulosGuardados: any[] = []; //Para guardar los modulos del formato 6
    modulos: any[] = [];



  constructor(
    private miServicio: ModulosService,
    private router: Router
  ) { 

  }

  ngOnInit(): void {

    this.modulos=[];

      this.agregarModulo();

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

trackByIndex(index: number, item: any): number {
  return index;
}

//Metodo para guardar el modulo 
guardarModulo(modulo: any): void {

  const moduloGuardado = {
    nombre: modulo.nombre,
    desde: modulo.desde,
    hasta: modulo.hasta,
    contenido:modulo.contenido,
    horario: modulo.horario.map(
      (horario: HorarioModulo) => ({
        tipo: horario.tipo,
        dias: [...horario.dias],
        horaDesde: horario.horaDesde,
        horaHasta: horario.horaHasta
      })
    )
  };

  this.modulosGuardados.push(moduloGuardado);

  console.log(
    'Módulo guardado:',
    moduloGuardado
  );

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
    inscripcionMatriculaDesde: '',
    inscripcionMatriculaHasta: '',
    ejecucionDesde: '',
    ejecucionHasta: '', 

   
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
    planificacionContenidos: [''],

    //Modulo 4
    evaluacion:'Se proporciconará, permanentemente, una evaluación potencializadora del talento humano en términos de auto evaluación y hetero-evaluación',
    acreditacionCalificacion:'REGLAMENTO DE LA DIRECCIÓN DE EDUCACIÓN CONTINUA, A DISTANCIA Y VIRTUAL DE LA UNIVERSIDAD TÉCNICA DE AMBATO aprobado por Consejo Universitario mediante Resolución 1000-CU-P-2023 de fecha 15 de septiembre de 2023.\n Artículo 40. De la acreditación de los cursos y/o programas de educación continua.- Para la acreditación (Aprobación) de los cursos y/o programas de educación continua se considerará:\nModalidad B-learning (híbrida o mixta)\n* Asistencia mínima: 90% y el cumplimiento total de las actividades obligatorias planificadas\n* Calificación mínima: 8.0/10',

    
  
  }
  horasCargaHoraria: number = 0;

  obtenerHorasCargaHoraria(): void {

  this.horasCargaHoraria =
    Number(this.formato6.cargaHoraria) || 0;

  
}

//Calcula el presupuesto

calcularTotalPresupuesto(indice: number): void { 
  const fila = this.presupuesto[indice]; 
  // La primera fila utiliza la carga horaria 
  if (indice === 0) { 
    const valor = Number(fila.valor) || 0; 
    const horas = Number(this.formato6.cargaHoraria) || 0; 
    fila.total = valor * horas; 
    } else { 
      // Las demás filas solamente toman el valor ingresado 
      fila.total = this.convertirNumero(fila.valor); 
    } 
    this.calcularTotalGeneral(); 
}

convertirNumero(valor: any): number { 
  
  if (valor === null || valor === undefined || valor === '') {
      return 0; 
    } 
    // Permite escribir 20,00 o 20.00 
    
    const texto = String(valor).replace(',', '.'); 
    
    return Number(texto) || 0; 
  
  }

  agregarFilaPresupuesto(): void { 

    this.presupuesto.push({ 
      
      partida: '', 
      descripcion: '', 
      valor: '', 
      total: 0 
    }); 
  }

  eliminarFilaPresupuesto(indice: number): void { 
    // No permitimos eliminar la primera fila 
    if (indice === 0) { 
      return; 
    } 
    this.presupuesto.splice(indice, 1); 
    this.calcularTotalGeneral(); 
  }

  calcularTotalGeneral(): number { 
    return this.presupuesto.reduce( 
      (suma: number, fila: any) => 
        suma + (Number(fila.total) || 0),0 ); 
}

//Agregar inputs y elimnarlos 

agregarContenido(i:number):void{
  this.modulos[i].contenidos.push('');
}

//Elimina el contenido
eliminarContenido(i: number, j:number): void {
  this.modulos[i].contenidos.splice(j,1);
}

trackByContenido(index: number, contenido: any): any {
  return contenido;
}

agregarObjetivoEspecifico(): void {
  this.formato6.objetivos.especificos.push('');
}

eliminarObjetivoEspecifico(index: number): void {
  this.formato6.objetivos.especificos.splice(index, 1);
}

//Agrega el modulo en el campo periodo


agregarModulo(): void {

  const nuevoModulo = {

    nombre: '',

    desde: '',

    hasta: '',

    contenidos:[
      ''
    ],

    horario: [
      {
        tipo: '',
        dias: [],
        horaDesde: '',
        horaHasta: ''
      }
    ] as HorarioModulo[]

  };

  this.modulos.push(nuevoModulo);

  console.log(
    'Nuevo módulo agregado:',
    nuevoModulo
  );

}






//Elimina el modulo que ya no necesite
eliminarModulo(index: number): void {

  this.modulos.splice(index, 1);

}

//Metodo para calcular las horas establecidas
calcularHorasHorario(
  horaDesde: string,
  horaHasta: string
): number {

  if (!horaDesde || !horaHasta) {
    return 0;
  }

  const [horaD, minutoD] = horaDesde
    .split(':')
    .map(Number);

  const [horaH, minutoH] = horaHasta
    .split(':')
    .map(Number);

  const minutosDesde =
    horaD * 60 + minutoD;

  const minutosHasta =
    horaH * 60 + minutoH;

  const diferencia =
    minutosHasta - minutosDesde;

  if (diferencia <= 0) {
    return 0;
  }

  return diferencia / 60;
}

//Metodo para mostrar los dias 
obtenerDiasHorario(
  horario: HorarioModulo
): string {

  if (!horario.dias || horario.dias.length === 0) {
    return 'Sin días seleccionados';
  }

  return horario.dias.join(', ');
}

//Metodo para obtener le fehca 
obtenerFechasHorario(
  modulo: any,
  horario: HorarioModulo
): string[] {

  if (
    !horario.dias ||
    horario.dias.length === 0 ||
    !modulo.desde ||
    !modulo.hasta
  ) {
    return [];
  }

  const fechas: string[] = [];

  const fechaInicio = new Date(
    modulo.desde + 'T00:00:00'
  );

  const fechaFin = new Date(
    modulo.hasta + 'T00:00:00'
  );

  const diasSemana: { [key: string]: number } = {
    'Domingo': 0,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6
  };

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

  const fechaActual = new Date(fechaInicio);

  while (fechaActual <= fechaFin) {

    const numeroDia = fechaActual.getDay();

    const diaEncontrado = horario.dias.find(
      dia => diasSemana[dia] === numeroDia
    );

    if (diaEncontrado) {

      const numeroFecha = String(
        fechaActual.getDate()
      ).padStart(2, '0');

      const nombreMes =
        meses[fechaActual.getMonth()];

      fechas.push(
        `${diaEncontrado} ${numeroFecha} ${nombreMes}`
      );
    }

    fechaActual.setDate(
      fechaActual.getDate() + 1
    );
  }

  return fechas;
}

//Metodo para calcular el total de horas de un horario

obtenerTotalHorasHorario(
  horario: HorarioModulo
): number {

  const horasPorClase =
    this.calcularHorasHorario(
      horario.horaDesde,
      horario.horaHasta
    );

  return horasPorClase;
}

//Suma las horas de los tipos de de clases

obtenerTotalHorasModulo(modulo: any): number {

  let total = 0;

  if (!modulo.horario) {
    return 0;
  }

  modulo.horario.forEach(
    (horario: HorarioModulo) => {

      // Calculamos cuánto dura una sesión
      const horasPorDia =
        this.calcularHorasHorario(
          horario.horaDesde,
          horario.horaHasta
        );

      // Calculamos cuántos días seleccionó
      const cantidadDias =
        horario.dias
          ? horario.dias.length
          : 0;

      // Multiplicamos las horas por la cantidad de días
      total += horasPorDia * cantidadDias;

    }
  );

  return total;
}




eliminarHorario(index: number): void {

  console.log('Eliminación de horario general:', index );

}

agregarHorarioModulo(modulo: any): void {

  modulo.horario.push({

    tipo: 'Clases en vivo (sincrónico)',

    dias: [],

    horaDesde: '',

    horaHasta: ''

  });

}


eliminarHorarioModulo(
  modulo: any,
  index: number
): void {

  modulo.horario.splice(index, 1);

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

        // =============================================
        // DATOS PRINCIPALES
        // =============================================

        fechaElaboracion: this.formato6.fechaElaboracion,
        requerimiento: this.formato6.requerimiento,
        unidadResponsable: this.formato6.unidadResponsable,
        instructores: this.formato6.instructores,
        beneficiarios: this.formato6.beneficiarios,
        paralelo: this.formato6.paralelo,
        modalidad: this.formato6.modalidad,
        area: this.formato6.area,
        cargaHoraria: this.formato6.cargaHoraria,

        inscripcionMatriculaDesde:this.formato6.inscripcionMatriculaDesde,

        inscripcionMatriculaHasta:this.formato6.inscripcionMatriculaHasta,

        ejecucionDesde:this.formato6.ejecucionDesde,

        ejecucionHasta:this.formato6.ejecucionHasta,

        modulos:this.modulos,


        // =============================================
        // DATOS ADICIONALES
        // =============================================

        lugar: this.formato6.lugar,
        prerrequisitos: this.formato6.prerrequisitos,
        tipoCertificado: this.formato6.tipoCertificado,
        inversion: this.formato6.inversion,

        // =============================================
        // NUEVOS CAMPOS DE CONTENIDO
        // =============================================

        introduccion: this.formato6.introduccion,
        justificacion: this.formato6.justificacion,

        objetivos: {
          general: this.formato6.objetivos.general,
          especificos: this.formato6.objetivos.especificos
        },

        metodologiaCurso: this.formato6.metodologiaCurso,

        planificacionContenidos: this.modulos
                .map(
                  (modulo: any, index: number) =>
                    `Módulo ${index + 1}: ${modulo.contenido || ''}`
                )
                .join('\n'),

        evaluacion: this.formato6.evaluacion,
        acreditacionCalificacion:this.formato6.acreditacionCalificacion,

        presupuesto:this.presupuesto
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
              respuesta?.data?.message,
              confirmButtonText:'Aceptar'
              
          }).then(()=>{
            this.router.navigate([
              
            ]);
          })

        }

      },

      error: (error) => {

        console.error(
          '========== ERROR FORMATO 6 =========='
        );

        console.error(
          'STATUS:',
          error.status
        );

        console.error(
          'MENSAJE:',
          error.message
        );

        console.error(
          'ERROR:',
          error.error
        );

        console.error(
          'TEXTO:',
          error.error?.text
        );

        console.error(
          '===================================='
        );

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            'Ocurrió un error al actualizar el Formato 6.'
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

      // =============================================
      // DATOS PRINCIPALES
      // =============================================

      fechaElaboracion: this.formato6.fechaElaboracion,
      requerimiento: this.formato6.requerimiento,
      unidadResponsable: this.formato6.unidadResponsable,
      instructores: this.formato6.instructores,
      beneficiarios: this.formato6.beneficiarios,
      paralelo: this.formato6.paralelo,
      modalidad: this.formato6.modalidad,
      area: this.formato6.area,
      cargaHoraria: this.formato6.cargaHoraria,

       inscripcionMatriculaDesde:
    this.formato6.inscripcionMatriculaDesde,

  inscripcionMatriculaHasta:
    this.formato6.inscripcionMatriculaHasta,

  ejecucionDesde:
    this.formato6.ejecucionDesde,

  ejecucionHasta:
    this.formato6.ejecucionHasta,

  modulos:
    this.modulos,

      // =============================================
      // DATOS ADICIONALES
      // =============================================

      lugar: this.formato6.lugar,
      prerrequisitos: this.formato6.prerrequisitos,
      tipoCertificado: this.formato6.tipoCertificado,
      inversion: this.formato6.inversion,

      // =============================================
      // NUEVOS CAMPOS DE CONTENIDO
      // =============================================

      introduccion: this.formato6.introduccion,
      justificacion: this.formato6.justificacion,

      objetivos: {
        general: this.formato6.objetivos.general,
        especificos: this.formato6.objetivos.especificos
      },

      metodologiaCurso: this.formato6.metodologiaCurso,

      planificacionContenidos: this.modulos
                  .map(
                    (modulo: any, index: number) =>
                      `Módulo ${index + 1}: ${modulo.contenido || ''}`
                  )
                  .join('\n'),
      evaluacion: this.formato6.evaluacion,

      acreditacionCalificacion:this.formato6.acreditacionCalificacion,

      presupuesto:this.presupuesto

    }



  };

  

  console.log(
    'Guardando nuevo Formato 6:',
    objetoopciones
  );

  console.log(
  '========== COMPROBACIÓN =========='
);

console.log(
  'INSCRIPCIÓN DESDE:',
  objetoopciones.d.inscripcionMatriculaDesde
);

console.log(
  'INSCRIPCIÓN HASTA:',
  objetoopciones.d.inscripcionMatriculaHasta
);

console.log(
  'EJECUCIÓN DESDE:',
  objetoopciones.d.ejecucionDesde
);

console.log(
  'EJECUCIÓN HASTA:',
  objetoopciones.d.ejecucionHasta
);

console.log(
  'MODULOS:',
  objetoopciones.d.modulos
);

console.log(
  'MODULOS GUARDADOS:',
  this.modulosGuardados
);

console.log(
  '==================================='
);

console.log('========== PLANIFICACIÓN ==========');

console.log(
  'MODULOS:',
  this.modulos
);

console.log(
  'MODULOS GUARDADOS:',
  this.modulosGuardados
);

console.log(
  'PLANIFICACIÓN ACTUAL:',
  this.formato6.planificacionContenidos
);

console.log(
  '====================================');


  console.log(
  'PLANIFICACIÓN QUE SE ENVÍA:',
  objetoopciones.d.planificacionContenidos
);

console.log(
  'TIPO PLANIFICACION:',
  typeof objetoopciones.d.planificacionContenidos
);

console.log(
  'VALOR PLANIFICACION:',
  objetoopciones.d.planificacionContenidos
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

        console.log(
        'MODULOS PARA GUARDAR:',
        this.modulos
      );

      console.log(
        'MODULOS GUARDADOS:',
        this.modulosGuardados
      );

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
        text:
          'Ocurrió un error al guardar el Formato 6.'
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
          this.formato6.ejecucionDesde=desde|| '';

          this.formato6.ejecucionHasta= hasta || '';

          // ===================================================== 
          // CREAR TEXTO CON EL RANGO SELECCIONADO 
          // =====================================================

          console.log( 'EJECUCIÓN FORMATO 6:', this.formato6.ejecucionDesde, 'hasta', this.formato6.ejecucionHasta );


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

          console.log('PERIODOS RECIBIDOS:', datos.formato6_periodos);
          console.log('HORARIO RECIBIDO:', datos.formato6_horario);

        

       

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
