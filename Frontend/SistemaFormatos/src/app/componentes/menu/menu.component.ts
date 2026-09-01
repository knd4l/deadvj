import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { UsersService } from 'src/app/servicios/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  mostrarMenu: boolean = false; // 👈 controla el menú
  usuariolog: string='';
 usuarioLogeado: any = [];
 usuarioLogJson: any = [];
 usuariosAc: any=[];
  idlogeado: string='';
  rollogeado: number=0;
  nombresUsuario: any='';
  encPassword: any;
  valoresPalabra: any = [];
  constructor(public CookieService:CookieService,public userService: UsersService,public router: Router,
    private msalService: MsalService,public auth: AuthService) { }

  ngOnInit(): void {
  /*  let cookie=this.CookieService.get('permisos');
    if(cookie==""){
      this.router.navigate(['/','login']);
    }else{
    this.usuarioLogJson=JSON.parse(this.CookieService.get('permisos'));
    this.usuariolog=this.CookieService.get('usu_log');
    this.checkLogeado(this.CookieService.get('usuario'));
    this.getVal();
    this.palabraEncriptar();
   }*/
   //console.log('👥 Cuentas:', this.msalService.instance.getAllAccounts());

  }


  logout() {

   Swal.fire({
		title: 'Salir del sistema',
		text: "Desea del sistema de formularios!",
		icon: 'error',
		showCancelButton: true,
		customClass: {
			confirmButton: 'btn btn-success',
			cancelButton: 'btn btn-danger'
		  },
		cancelButtonColor: '#d33',
    confirmButtonColor:'#f26522',
		confirmButtonText: 'Si, salir!',
		cancelButtonText: 'Cancelar'
	  }).then((result) => {
		if (result.isConfirmed) {
    /*  this.CookieService.set('permisos',"");
    this.CookieService.set('usuario',"");
    this.CookieService.set('usu_log',"");
    this.router.navigate(['/','login']);*/

      this.auth.logout();
      this.router.navigate(['/','login']);

    }else{
      this.router.navigate(['/','principal']);
    }
    })

       // remove user from local storage to log user out

    //window.location.reload();
   // location.href="https://deadv.uta.edu.ec/posgrados/formulario/";
}
  checkLogeado(id: string){
    // this.actas=this.actasAux;
     this.usuarioLogeado= [];
     let data: any;

         data = {
         fx: 'usuariosPermisos',
         d: {"fid":id},
         dpro: 0,
         dus: 0,
         dcx: 1
         };

         this.userService.getUsuarioLogeado(data).subscribe(
         res => {
         let dataobjm: any;
         dataobjm = res;


         if (dataobjm.data.success && dataobjm.data.estado > 0)
         {
           "se ejecuto bien hacer algo aqui";
       this.usuarioLogeado=dataobjm.data.item;

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
          this.nombresUsuario=this.usuariosAc[0].nombres+' '+this.usuariosAc[0].apellidos;
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
