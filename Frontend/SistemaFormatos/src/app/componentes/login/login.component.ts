import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsersService } from '../../servicios/users.service';
import { CookieService } from 'ngx-cookie-service';
import { AccountInfo } from '@azure/msal-browser';
import {
  MsalBroadcastService,
  MsalService
} from '@azure/msal-angular';

import {
  EventMessage,
  EventType,
  InteractionStatus,
  AuthenticationResult
} from '@azure/msal-browser';

import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  template: `<h2>Iniciando sesión con Microsoft...</h2>`
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  vistalogin = true;
  vistarestablece = false;
  loginEnProceso = false; // 👈 CLAVE
  loading = false;



  constructor(
    private fb: FormBuilder,
    private loginService: UsersService,
    private router: Router,
    private cookie: CookieService,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {

    // 🔔 CONTROL GLOBAL DE ESTADO MSAL
    this.msalBroadcastService.inProgress$
      .subscribe(status => {
        this.loginEnProceso = status !== InteractionStatus.None;
      });

    // ✅ CUANDO EL LOGIN YA TERMINÓ
    this.msalBroadcastService.inProgress$
      .pipe(filter(status => status === InteractionStatus.None))
      .subscribe(() => {

        const account =
          this.msalService.instance.getActiveAccount() ||
          this.msalService.instance.getAllAccounts()[0];

        if (account) {
          console.log('✅ LOGIN EXITOSO');
          console.log('📧 Email:', account.username);
          console.log('👤 Nombre:', account.name);
          console.log('🆔 Tenant:', account.tenantId);

          // 👉 Aquí tu validación interna si quieres
          this.router.navigate(['/principal']);
        }
      });

    // 📡 EVENTO LOGIN SUCCESS
    this.msalBroadcastService.msalSubject$
      .pipe(filter(msg => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe((result: EventMessage) => {
        const authResult = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(authResult.account);
        console.log('🟢 TOKEN OK', authResult);
      });
  }


  loginMicrosoft(): void {

    if (this.loading) {
      console.log('⏳ Login ya en proceso, esperando...');
      return;
    }

    this.loading = true;

    this.msalService.loginRedirect({
      scopes: ['user.read']
    });
  }
 

  loginUsuario(): void {

    if (this.loginForm.invalid) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }

    const data = {
      fx: 'loginusuario',
      d: {
        fnombreUsuario: this.loginForm.value.usuario,
        fpasswordUsuario: this.loginForm.value.contrasena
      },
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    this.loginService.getUsuarioLogin(data).subscribe({
      next: (res: any) => {
        if (res.data.success && res.data.estado > 0) {
          this.cookie.set('usuario', res.data.item[0].identificacion);
          this.router.navigate(['/formatouno']);
        } else {
          this.mostrarError();
        }
      },
      error: () => this.mostrarError()
    });
  }

  mostrarError() {
    Swal.fire({
      icon: 'error',
      title: 'Credenciales incorrectas',
      text: 'Usuario suspendido o contraseña inválida'
    });
    this.loginForm.reset();
  }
}
