import { Component, OnInit } from '@angular/core';
import { UsersService} from '../../servicios/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuariosistema',
  templateUrl: './usuariosistema.component.html',
  styleUrls: ['./usuariosistema.component.css']
})
export class UsuariosistemaComponent implements OnInit {
  usuarioscedula: any = [];
  usuarioscorreo: any = [];
  constructor(private userService: UsersService ) { }

  ngOnInit(): void {
  }

  GuardarUsuario(){
    var cedulaN = (<HTMLInputElement>document.getElementById("txt_cedula")).value;
    var nombres = (<HTMLInputElement>document.getElementById("txt_nombres")).value;
    var apellidos = (<HTMLInputElement>document.getElementById("txt_apellidos")).value;
    var telefono = (<HTMLInputElement>document.getElementById("txt_telefono")).value;
    var correo = (<HTMLInputElement>document.getElementById("txt_correoins")).value;
    const originalString = correo;

// Split string by whitespace character
const splitcorreo = originalString.split("@");
var basecorreo="uta.edu.ec";
(this.usuarioscorreo);
    if (cedulaN.toString() == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        showDenyButton: true,
        showConfirmButton: false,
        text: 'Ingresar número de identificación!',
        denyButtonText: `Aceptar`
        });
    } else if (nombres.toString() == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        showDenyButton: true,
        showConfirmButton: false,
        text: 'Ingrese los nombres!',
        denyButtonText: `Aceptar`
        });
    } else if (apellidos.toString() == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        showDenyButton: true,
        showConfirmButton: false,
        text: 'Ingrese los apellidos!',
        denyButtonText: `Aceptar`
        });
    } else if (correo.toString() == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        showDenyButton: true,
        showConfirmButton: false,
        text: 'Ingrese correo!',
        denyButtonText: `Aceptar`
        });
    }else if (splitcorreo[1] != basecorreo) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        showDenyButton: true,
        showConfirmButton: false,
        text: 'Ingresar correo institucional!',
        denyButtonText: `Aceptar`
        });
    }else{
    let data: any;

		    data = {
		    fx: 'insertarusuario',
		    d: {"identificacion":cedulaN,"apellidos":apellidos, "nombres":nombres,"telefono":telefono,
        "correo":correo},
		    dpro: 0,
		    dus: 0,
		    dcx: 1
		    };

		    this.userService.guardarUsuario(data).subscribe(
          res => {
		    let dataobj: any;
		    dataobj = res;


		    if (dataobj.data.success && dataobj.data.estado > 0)
		    {
				"se ejecuto bien hacer algo aqui";
				this.limpiar();
        ('guardado');
		    }else{
          ('no se guardo');
      "se ejecuto mal hacer algo aqui"
		  	}

		  }, (err: HttpErrorResponse) => {
		   	  "error general hacer algo aqui no llamo al servidor o un error grave en el servidor"
		   if (err.error instanceof Error) {

		   } else {

		   }
		  }
		);
	}
  }
  limpiar(){
    (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
    (<HTMLInputElement>document.getElementById("txt_nombres")).value="";
    (<HTMLInputElement>document.getElementById("txt_apellidos")).value="";
    (<HTMLInputElement>document.getElementById("txt_telefono")).value="";
    (<HTMLInputElement>document.getElementById("txt_correoins")).value="";
    }

    checkCedula(){
      var cedulaN = (<HTMLInputElement>document.getElementById("txt_cedula")).value;
       let data: any;

           data = {
           fx: 'verusuariocedula',
           d: {"fid":cedulaN},
           dpro: 0,
           dus: 0,
           dcx: 1
           };

           this.userService.getUsuarioCedula(data).subscribe(
             res => {
           let dataobj: any;
           dataobj = res;


           if (dataobj.data.success && dataobj.data.estado > 0)
           {
           "se ejecuto bien hacer algo aqui";
           Swal.fire({
            icon: 'error',
            title: 'Oops...',
            showDenyButton: true,
            showConfirmButton: false,
            text: 'La cedula ya ha sido registrada!',
            denyButtonText: `Aceptar`
            });
           (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
           this.usuarioscedula=dataobj.data.item;
           }else{
          // this.limpiar();
   "se ejecuto mal hacer algo aqui"
           }

         }, (err: HttpErrorResponse) => {
              "error general hacer algo aqui no llamo al servidor o un error grave en el servidor"
          if (err.error instanceof Error) {

          } else {

          }
         }
       );

     }

     checkCorreo(){
      var correo = (<HTMLInputElement>document.getElementById("txt_correoins")).value;
      let data: any;

          data = {
          fx: 'verusuariocorreo',
          d: {"fid":correo},
          dpro: 0,
          dus: 0,
          dcx: 1
          };

          this.userService.getUsuarioCorreo(data).subscribe(
            res => {
          let dataobj: any;
          dataobj = res;


          if (dataobj.data.success && dataobj.data.estado > 0)
          {
          "se ejecuto bien hacer algo aqui";
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            showDenyButton: true,
            showConfirmButton: false,
            text: 'El correo ya ha sido registrado!',
            denyButtonText: `Aceptar`
            });
          (<HTMLInputElement>document.getElementById("txt_correoins")).value="";
          this.usuarioscorreo=dataobj.data.item;
          }else{
         // this.limpiar();
  "se ejecuto mal hacer algo aqui"
          }

        }, (err: HttpErrorResponse) => {
             "error general hacer algo aqui no llamo al servidor o un error grave en el servidor"
         if (err.error instanceof Error) {

         } else {

         }
        }
      );

    }
//ValidarCedula

validarCedula(cedula: string) {

  if (cedula.length === 10) {

    // Obtenemos el digito de la region que sonlos dos primeros digitos
    const digitoRegion = cedula.substring(0, 2);

    // Pregunto si la region existe ecuador se divide en 24 regiones
    if (digitoRegion >= String(0) && digitoRegion <= String(24)) {

      // Extraigo el ultimo digito
      const ultimoDigito = Number(cedula.substring(9, 10));

      // Agrupo todos los pares y los sumo
      const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));

      // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
      let numeroUno: any = cedula.substring(0, 1);
      numeroUno = (numeroUno * 2);
      if (numeroUno > 9) {
        numeroUno = (numeroUno - 9);
      }

      let numeroTres: any = cedula.substring(2, 3);
      numeroTres = (numeroTres * 2);
      if (numeroTres > 9) {
        numeroTres = (numeroTres - 9);
      }

      let numeroCinco: any = cedula.substring(4, 5);
      numeroCinco = (numeroCinco * 2);
      if (numeroCinco > 9) {
        numeroCinco = (numeroCinco - 9);
      }

      let numeroSiete: any = cedula.substring(6, 7);
      numeroSiete = (numeroSiete * 2);
      if (numeroSiete > 9) {
        numeroSiete = (numeroSiete - 9);
      }

      let numeroNueve: any = cedula.substring(8, 9);
      numeroNueve = (numeroNueve * 2);
      if (numeroNueve > 9) {
        numeroNueve = (numeroNueve - 9);
      }

      const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

      // Suma total
      const sumaTotal = (pares + impares);

      // extraemos el primero digito
      const primerDigitoSuma = String(sumaTotal).substring(0, 1);

      // Obtenemos la decena inmediata
      const decena = (Number(primerDigitoSuma) + 1) * 10;

      // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
      let digitoValidador = decena - sumaTotal;

      // Si el digito validador es = a 10 toma el valor de 0
      if (digitoValidador === 10) {
        digitoValidador = 0;
      }

      // Validamos que el digito validador sea igual al de la cedula
      if (digitoValidador === ultimoDigito) {
        return true;
      } else {
        return false;
      }

    } else {
      // imprimimos en consola si la region no pertenece
      return false;
    }
  } else {
    // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
    return false;
  }

}

}
