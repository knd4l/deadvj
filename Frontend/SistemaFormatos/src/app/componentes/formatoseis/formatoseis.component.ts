import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ModulosService } from 'src/app/servicios/modulos.service';

@Component({
  selector: 'app-formatoseis',
  templateUrl: './formatoseis.component.html',
  styleUrls: ['./formatoseis.component.css']
})
export class FormatoseisComponent implements OnInit {


    formato1Codigo:number=0;
   cursoNombre: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private miServicio: ModulosService
  ) { 
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {

    this.cursoNombre =
      navigation.extras.state['cursoNombre'];

  }


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

    //Recuperamos el id del formato 1

    this.route.queryParams.subscribe(params => {

      const formato1Codigo = params['formato1_codigo'];
      if(formato1Codigo){
        console.log("Codigo del formato 1 recibido",
          formato1Codigo);

          this.formato1Codigo=Number(formato1Codigo);

          this.cargarDatosFormato1(this.formato1Codigo);


     
      }else{
        console.log('No se recibió el código del Formato 1');
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

    console.log('Datos del Formato 6:', this.formato6);

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
}
