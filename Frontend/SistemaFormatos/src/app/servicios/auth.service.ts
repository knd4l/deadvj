import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private msalService: MsalService,
    private cookie: CookieService
  ) {}

  /** Login Microsoft */
  isMicrosoftLogged(): boolean {
    const account = this.msalService.instance.getActiveAccount()
      || this.msalService.instance.getAllAccounts()[0];
    return !!account;
  }

  /** Login sistema */
  isSystemLogged(): boolean {
    return this.cookie.get('usuario') !== '';
  }

  /** Sesión válida */
  isLogged(): boolean {
    return this.isMicrosoftLogged() || this.isSystemLogged();
  }

  logout(): void {
    this.cookie.deleteAll();
    this.msalService.logoutRedirect();
  }
}
