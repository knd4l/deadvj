import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VigilanteGuard implements CanActivate {

  constructor(
    private router: Router,
    private msalService: MsalService,
    private cookie: CookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const microsoftAccount =
      this.msalService.instance.getActiveAccount()
      || this.msalService.instance.getAllAccounts()[0];

    const systemLogged = this.cookie.check('permisos');

    if (microsoftAccount || systemLogged) {
      return true;
    }

    console.warn('🚫 Acceso denegado, redirigiendo a login');
    this.router.navigate(['/login']);
    return false;
  }
}
