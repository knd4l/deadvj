import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/servicios/users.service';
import { CookieService } from "ngx-cookie-service";
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiperfilComponent implements OnInit {
  usuariosAc: any=[];
  rolid: any;
  usuarioscorreo: any = [];

  encPassword: any;
  valoresPalabra: any = [];
  constructor(public CookieService:CookieService,private userService: UsersService,public router: Router) { }

  ngOnInit(): void {
    this.palabraEncriptar();
    this.getVal();

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
      this.getVal();

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
  getVal(){
    var id = Number(this.CookieService.get('usuario'));
    let data: any;

		    data = {
		    fx: 'verusuarioid',
		    d: {"fid":id,"fclave":this.encPassword},
		    dpro: 0,
		    dus: 0,
		    dcx: 1
		    };

		    this.userService.getUsuariosId(data).subscribe(
          res => {
		    let dataobj: any;
		    dataobj = res;


		    if (dataobj.data.success && dataobj.data.estado > 0)
		    {
				"se ejecuto bien hacer algo aqui";
        this.usuariosAc=dataobj.data.item;
        this.rolid=this.usuariosAc[0].rolid;
        (<HTMLInputElement>document.getElementById("txt_cedula")).value=this.usuariosAc[0].identificacion;
       (<HTMLInputElement>document.getElementById("txt_apellidos")).value=this.usuariosAc[0].apellidos;
       (<HTMLInputElement>document.getElementById("txt_nombres")).value=this.usuariosAc[0].nombres;
       (<HTMLInputElement>document.getElementById("txt_telefono")).value=this.usuariosAc[0].telefono;
       (<HTMLInputElement>document.getElementById("txt_correoins")).value=this.usuariosAc[0].correo;
       (<HTMLInputElement>document.getElementById("txt_rol")).value=this.usuariosAc[0].rolnombre;
       //(<HTMLInputElement>document.getElementById("txt_usu")).value=this.usuariosAc[0].usu;
       //(<HTMLInputElement>document.getElementById("txt_contrase")).value=this.usuariosAc[0].contra;

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


  onClickActualizar(){
    var id = Number(this.CookieService.get('usuario'));
    var cedulaN = (<HTMLInputElement>document.getElementById("txt_cedula")).value;
    var nombres = (<HTMLInputElement>document.getElementById("txt_nombres")).value;
    var apellidos = (<HTMLInputElement>document.getElementById("txt_apellidos")).value;
    var telefono = (<HTMLInputElement>document.getElementById("txt_telefono")).value;
    var correo = (<HTMLInputElement>document.getElementById("txt_correoins")).value;
    var usu = (<HTMLInputElement>document.getElementById("txt_usu")).value;
    var contra = (<HTMLInputElement>document.getElementById("txt_contrase")).value;
    const originalString = correo;
  const splitcorreo = originalString.split("@");
  var basecorreo="uta.edu.ec";
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
    }
    else if (usu.toString() == "") {
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
    }else{
    let data: any;

        data = {
        fx: 'actualizarusuario',
        d: {"identificacion":cedulaN,"apellidos":apellidos, "nombres":nombres,"telefono":telefono,
        "correo":correo,"rol":this.rolid,"id":id,"contra":contra,"usu":usu},
        dpro: 0,
        dus: 0,
        dcx: 1
        };
        this.userService.actualizarUsuarios(data).subscribe(
          res => {
        let dataobj: any;
        dataobj = res;

        if (dataobj.data.success && dataobj.data.estado > 0)
        {
        "se ejecuto bien hacer algo aqui";
        location.href="https://deadv.uta.edu.ec/posgrados/formulario";
        this.limpiar();

        //this.GuardarRolesPermiso(dataobj.data.rcount);
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
  }

  limpiar(){
    (<HTMLInputElement>document.getElementById("txt_cedula")).value="";
    (<HTMLInputElement>document.getElementById("txt_nombres")).value="";
    (<HTMLInputElement>document.getElementById("txt_apellidos")).value="";
    (<HTMLInputElement>document.getElementById("txt_telefono")).value="";
    (<HTMLInputElement>document.getElementById("txt_correoins")).value="";
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
        (char);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          showDenyButton: true,
          showConfirmButton: false,
          text: 'Solo se permite letras!',
          denyButtonText: `Aceptar`
        });

        var re = char;
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
          text: 'Solo se permite letras!',
          denyButtonText: `Aceptar`
        });
        var re = char;
        var newstr = value.replace(re, "");
        (<HTMLInputElement>document.getElementById("txt_apellidos")).value=newstr;
      }
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

}
