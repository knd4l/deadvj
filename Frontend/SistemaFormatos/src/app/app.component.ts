import { Component, OnInit} from '@angular/core';
export let browserRefresh = false;
import { CookieService } from "ngx-cookie-service";
import { RouterLink, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { AuthService } from './servicios/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
    <app-menu *ngIf="auth.isLogged()"></app-menu>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit{
  private redirectHandled = false; // ⬅ evita doble ejecución
  title = 'Formatos';
  constructor(public CookieService:CookieService,public router: Router,private msalService: MsalService,public auth: AuthService) { }
  ngOnInit(): void {

    // ⛔ Importante: SOLO aquí se maneja el redirect
    this.msalService.instance.handleRedirectPromise()
      .then((result: AuthenticationResult | null) => {

        // 🛑 Evita que se ejecute 2 veces
        if (this.redirectHandled) return;
        this.redirectHandled = true;

        if (result?.account) {

          this.msalService.instance.setActiveAccount(result.account);

          console.log('✅ LOGIN PROCESADO EN APP');
          console.log('📧 Email:', result.account.username);
          console.log('👤 Nombre:', result.account.name);
          console.log('🆔 Tenant:', result.account.tenantId);

          // 👉 REDIRECCIÓN ÚNICA
          this.router.navigate(['/principal']);

        } else {

          // 🟢 Si ya hay sesión (F5 / refresh)
          const account = this.msalService.instance.getActiveAccount()
            || this.msalService.instance.getAllAccounts()[0];

          if (account) {
            this.msalService.instance.setActiveAccount(account);
           // this.router.navigate(['/principal']);
          } else {
            console.log('ℹ️ No hay sesión activa');
          }
        }
      })
      .catch(err => {
        console.error('❌ Redirect error', err);
      });
  }
}
