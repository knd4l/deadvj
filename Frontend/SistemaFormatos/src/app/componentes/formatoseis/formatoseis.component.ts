import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-formatoseis',
  templateUrl: './formatoseis.component.html',
  styleUrls: ['./formatoseis.component.css']
})
export class FormatoseisComponent implements OnInit {


   cursoNombre: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute
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

      console.log(
        'Curso recibido en Formato 6:',
        this.cursoNombre
      );
    }else{
      console.log(
        'No existe un curso guardado para el Formato 6'
      );
    }

    
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

}
