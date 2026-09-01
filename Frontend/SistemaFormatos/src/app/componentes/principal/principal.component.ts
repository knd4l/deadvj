import { Component, OnInit } from '@angular/core';
import { UsersService} from '../../servicios/users.service';
import { RouterLink, Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  usuarios: any =[];
  usuariosaux: any=[];

  usuario = {
    idUsuario: null,
    nombre: null,
    telefono: null,
    email: null
  }
  constructor(private usersService: UsersService, public router: Router,private route: ActivatedRoute) { }
  $_route$: Subscription;
  ngOnInit(): void {
    this.mostrar();

  }

  mostrar(){
    (<HTMLInputElement>document.getElementById("sidenavAccordion")).style.display = 'block';
    (<HTMLInputElement>document.getElementById("sidebarToggle")).style.display = 'block';
    (<HTMLInputElement>document.getElementById("sidebarSalir")).style.display = 'block';
  }


}
