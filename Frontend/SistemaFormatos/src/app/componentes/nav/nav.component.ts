import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  nombreUsuario: string = '';
  emailUsuario: string = '';

  constructor(private msalService: MsalService) { }

  ngOnInit(): void {

    // Obtener usuario activo
    const account: AccountInfo | null =
      this.msalService.instance.getActiveAccount()
      || this.msalService.instance.getAllAccounts()[0];

    if (account) {
      this.nombreUsuario = account.name ?? '';
      this.emailUsuario = account.username ?? '';

      console.log('👤 Usuario en menú:', account);
    }
  }
}
