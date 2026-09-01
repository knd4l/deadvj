import { Component, OnInit } from '@angular/core';

import { UsersService} from '../../servicios/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormulariosService } from 'src/app/servicios/formularios.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarioscedula: any = [];
  usuarioscorreo: any = [];
  roles: any = [];
  ipAddress: any;
  fecha: any;
  tipodocu:any;
  mivalor:any;
  deviceInfo : DeviceInfo;
  public navegador:any;
  public encPassword: string;
  valoresPalabra: any = [];
  constructor(public CookieService:CookieService,private formularioService: FormulariosService, private deviceService: DeviceDetectorService,private userService: UsersService,private router:Router ) {

  }


  ngOnInit(): void {
    this.palabraEncriptar();
    this.cargarRoles();
    this.getIP();
    this.tipodocu='Seleccionar';
  }

  palabraEncriptar(){
    let data: any;

        data = {
        fx: 'encriptar',
        d: {},
        dpro: 0,
        dus: 0,
        dcx: 1
        };

        this.userService.getPalabra(data).subscribe(
        res => {
        let dataobjm: any;
        dataobjm = res;
        if (dataobjm.data.success && dataobjm.data.estado > 0)
        {
          "se ejecuto bien hacer algo aqui";
      this.valoresPalabra=dataobjm.data.item;
      this.encPassword=this.valoresPalabra[0].palabrasecreta;
//poner el codigo en insertar
    }else{

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

  cargarRoles(){
    let data: any;

		    data = {
		    fx: 'vertodosroles',
		    d: {},
		    dpro: 0,
		    dus: 0,
		    dcx: 1
		    };

		    this.formularioService.getRoles(data).subscribe(
          res => {
		    let dataobj: any;
		    dataobj = res;


		    if (dataobj.data.success && dataobj.data.estado > 0)
		    {
				"se ejecuto bien hacer algo aqui";
        this.roles=dataobj.data.item;

       (this.roles);
		    }else{
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

  validarTelefono(evt: any){
  let value = (<HTMLInputElement>document.getElementById("txt_telefono")).value;
	for (let char of value) {
		var NUMERO_REGEX = /[0-9]/;
		if(!NUMERO_REGEX.test(char)){
			(char);
		  Swal.fire({
				icon: 'error',
				title: 'Oops...',
				showDenyButton: true,
				showConfirmButton: false,
				text: 'Ingrese solo números!',
				denyButtonText: `Aceptar`
			  });
		  var re = char;
		  var newstr = value.replace(re, "");
		  (<HTMLInputElement>document.getElementById("txt_telefono")).value=newstr;
		}
	}
}

validarNombre(evt: any){
  let value = (<HTMLInputElement>document.getElementById("txt_nombres")).value;

for (let char of value) {
  var NUMERO_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ /s]*$/;
  if(!NUMERO_REGEX.test(char)){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showDenyButton: true,
      showConfirmButton: false,
      text: 'Ingrese solo letras!',
      denyButtonText: `Aceptar`
      });
    var re = char.toUpperCase();
    var newstr = value.replace(re, "");
    (<HTMLInputElement>document.getElementById("txt_nombres")).value=newstr;
  }

}

}
validarApellido(evt: any){
  let value = (<HTMLInputElement>document.getElementById("txt_apellidos")).value;
for (let char of value) {
  var NUMERO_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ /s]*$/;
  if(!NUMERO_REGEX.test(char)){
    (char);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showDenyButton: true,
      showConfirmButton: false,
      text: 'Ingrese solo letras!',
      denyButtonText: `Aceptar`
      });
    var re = char;
    var newstr = value.replace(re, "");
    (<HTMLInputElement>document.getElementById("txt_apellidos")).value=newstr;
  }
}
}

tipodocumento(valor:any){

  (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
  this.tipodocu=(<HTMLInputElement>document.getElementById("cbx_tipodoc")).value;


  }
  tipousuario(valor:any){
  let rol=(<HTMLInputElement>document.getElementById("txt_usu")).value;
  const rolstring = rol;
  let splitrol = valor.split("-");
    if(splitrol[0]==0 || splitrol[0]==1 ||splitrol[0]==3){

     (<HTMLInputElement>document.getElementById("txt_usu")).style.display="none";
     (<HTMLInputElement>document.getElementById("txt_contrase")).style.display="none";

    }else{
      (<HTMLInputElement>document.getElementById("txt_usu")).style.display="block";
      (<HTMLInputElement>document.getElementById("txt_contrase")).style.display="block";
    }
    }

    onFocusOutEvent(event: any){
      var documento = (<HTMLInputElement>document.getElementById("cbx_tipodoc")).value;
      var cedulaN = (<HTMLInputElement>document.getElementById("txt_cedula")).value;

      if (this.tipodocu.toString() == "Cedula") {
        let valor=(event.target.value);
        if(valor.length<10){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            showDenyButton: true,
            showConfirmButton: false,
            text: 'Ingresar identificación correcta!',
            denyButtonText: `Aceptar`
          });
        }else{
          //  this.validarCedula(cedulaN);

            if(this.validarCedula(cedulaN)){
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
                text: 'La identificación ya ha sido registrada!',
                denyButtonText: `Aceptar`
                });
               //swal( "Oops" ,  "Something went wrong!" ,  "error" );
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
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              showDenyButton: true,
              showConfirmButton: false,
              text: 'La identificación ingresada no es correcta!',
              denyButtonText: `Aceptar`
              });
              (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
          }
          }//no es cedula
        }//else para pasaporte
        else{
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
                text: 'La identificación ya ha sido registrada!',
                denyButtonText: `Aceptar`
                });
               //swal( "Oops" ,  "Something went wrong!" ,  "error" );
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



   }

  getIP()
  {
    this.formularioService.getIPAddress().subscribe((res:any)=>{
      this.ipAddress=res.ip;
    });
  }

  insertarLog(userlog: any,userupdate:any){
    this.getIP();
    this.deviceInfo=this.deviceService.getDeviceInfo();
     this.navegador="Navegador: "+this.deviceInfo.browser+" "+this.deviceInfo.browser_version+", Sistema Operativo: "+this.deviceInfo.os_version+", Dispositivo: "+this.deviceInfo.deviceType;
    this.cargarFechaHora();
    let accion="CREATE USER"
    let descripcion='Se creo el usuario '+userupdate;
     let data: any;

         data = {
         fx: 'insertarLog',
         d: {"fuser_log":userlog,"fip_log":this.ipAddress,"ftime_log":this.fecha,"faction_log":accion,"fdescripcion_log":descripcion, "fnavegador_log":this.navegador},
         dpro: 0,
         dus: 0,
         dcx: 1
         };

         this.formularioService.InsertLog(data).subscribe(
         res => {
         let dataobjm: any;
         dataobjm = res;


         if (dataobjm.data.success && dataobjm.data.estado > 0)
         {
           "se ejecuto bien hacer algo aqui";

         }else{
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

GuardarUsuario(){
    var cedulaN = (<HTMLInputElement>document.getElementById("txt_cedula")).value;
    var nombres = (<HTMLInputElement>document.getElementById("txt_nombres")).value;
    var apellidos = (<HTMLInputElement>document.getElementById("txt_apellidos")).value;
    var telefono = (<HTMLInputElement>document.getElementById("txt_telefono")).value;
    var correo = (<HTMLInputElement>document.getElementById("txt_correoins")).value;
    var rol = (<HTMLInputElement>document.getElementById("cbx_Rol")).value;
    var usu = (<HTMLInputElement>document.getElementById("txt_usu")).value;
    var contra = (<HTMLInputElement>document.getElementById("txt_contrase")).value;
    const originalString = correo;
const splitcorreo = originalString.split("@");
var basecorreo="uta.edu.ec";
const rolstring = rol;
let splitrol = rolstring.split("-");
if(splitrol[0]=='0' || splitrol[0]=='1' || splitrol[0]=='3'){
  usu=correo;
  contra=cedulaN;
  }
if (cedulaN.toString() == "") {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    showDenyButton: true,
    showConfirmButton: false,
    text: 'Ingresar identificacion!',
    denyButtonText: `Aceptar`
  });
} else if (rol.toString() == "") {

  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    showDenyButton: true,
    showConfirmButton: false,
    text: 'Seleccione un rol!',
    denyButtonText: `Aceptar`
  });
}else if (nombres.toString() == "") {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    showDenyButton: true,
    showConfirmButton: false,
    text: 'Ingresar los nombres!',
    denyButtonText: `Aceptar`
  });
} else if (apellidos.toString() == "") {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    showDenyButton: true,
    showConfirmButton: false,
    text: 'Ingresar los apellidos!',
    denyButtonText: `Aceptar`
  });
} else if (correo.toString() == "") {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    showDenyButton: true,
    showConfirmButton: false,
    text: 'Ingresar el correo !',
    denyButtonText: `Aceptar`
  });
}else if (splitcorreo[1] != basecorreo) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    showDenyButton: true,
    showConfirmButton: false,
    text: 'Ingrese correo institucional!',
    denyButtonText: `Aceptar`
  });
}else
  if (usu.toString() == "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showDenyButton: true,
      showConfirmButton: false,
      text: 'Ingresar el usuario !',
      denyButtonText: `Aceptar`
    });
  }else if (contra.toString() == "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showDenyButton: true,
      showConfirmButton: false,
      text: 'Ingrese la contraseña!',
      denyButtonText: `Aceptar`
    });
  }
else{
    let data: any;

		    data = {
		    fx: 'insertarusuario',
		    d: {"identificacion":cedulaN,"apellidos":apellidos, "nombres":nombres,"telefono":telefono,
        "correo":correo,"rolid":splitrol[0],"contra":contra,"usu":usu,"palabrasecreta":this.encPassword},
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
        if(splitrol[0]=='2' || splitrol[0]=='4' || splitrol[0]=='5'){
           this.GuardarRolesPermiso(dataobj.data.rcount);
        }

        this.insertarLog(this.CookieService.get('usuario'),dataobj.data.rcount);
        this.router.navigate(['/listarusuarios']);
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
  GuardarRolesPermiso(usuariorol:any){
    var rol = (<HTMLInputElement>document.getElementById("cbx_Rol")).value;
    var proceso='proc_001'
    let data: any;

		    data = {
		    fx: 'insertRolesPermisos',
		    d: {"frolpermiso_rolid":rol,"frolpermiso_procesocodigo":proceso, "frolpermiso_usu_codigo":usuariorol},
		    dpro: 0,
		    dus: 0,
		    dcx: 1
		    };

		    this.userService.guardarRolesPermisos(data).subscribe(
          res => {
		    let dataobj: any;
		    dataobj = res;


		    if (dataobj.data.success && dataobj.data.estado > 0)
		    {
				"se ejecuto bien hacer algo aqui";
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
  limpiar(){
    (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
    (<HTMLInputElement>document.getElementById("txt_nombres")).value="";
    (<HTMLInputElement>document.getElementById("txt_apellidos")).value="";
    (<HTMLInputElement>document.getElementById("txt_telefono")).value="";
    (<HTMLInputElement>document.getElementById("txt_correoins")).value="";
    }

    checkCedula(evt:any){
      if(this.tipodocu.toString()== "Seleccionar"){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          showDenyButton: true,
          showConfirmButton: false,
          text: 'Seleccione el tipo de identificación!',
          denyButtonText: `Aceptar`
          });
          (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
      }

     }
     alertamenor(){
       let cedu=(<HTMLInputElement>document.getElementById("txt_cedula")).value;
      if(cedu.length<10){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          showDenyButton: true,
          showConfirmButton: false,
          text: 'La identificación debe tener minimo 10 dígitos!',
          denyButtonText: `Aceptar`
          });
         //swal( "Oops" ,  "Something went wrong!" ,  "error" );
         (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
      }
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
validarNumero(evt: any){
	let telefono=(<HTMLInputElement>document.getElementById("inputtelefono")).value;
	for (let char of telefono) {
		var NUMERO_REGEX = /[0-9]/;
		if(!NUMERO_REGEX.test(char)){
		  Swal.fire({
				icon: 'error',
				title: 'Oops...',
				showDenyButton: true,
				showConfirmButton: false,
				text: 'Ingrese solo números!',
				denyButtonText: `Aceptar`
			  });
		  var re = char;
		  var newstr = telefono.replace(re, "");
		  (<HTMLInputElement>document.getElementById("inputtelefono")).value=newstr;
		}
	}
  }

validarCedula(cedula: any) {

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

cargarFechaHora() {
  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth() + 1;
  var yyyy = hoy.getFullYear();
  var d = dd.toString();
  var m = mm.toString();
  if (dd < 10) {
    d = '0' + dd;
  }
  if (mm < 10) {
    m = '0' + mm;
  }
  var h = yyyy + '-' + m + '-' + d;
  var ho = hoy.getHours();
  var mi = hoy.getMinutes();
var seg=hoy.getSeconds();
  var hos = ho.toString();
  var mis = mi.toString();
var segu = seg.toString();
  if (ho < 10) {
    hos = '0' + hos;
  }
  if (mi < 10) {
    mis = '0' + mis;
  }
if (seg < 10) {
  segu = '0' + seg;
  }
  var hora = hos + ':' + mis + ':00';

  //(<HTMLInputElement>document.getElementById("txt_fechasol")).value = h;
this.fecha=h+' '+hora;


}

}
