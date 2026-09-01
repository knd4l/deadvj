import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
export let browserRefresh = false;
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersService } from './servicios/users.service';
import { NavComponent } from './componentes/nav/nav.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { CookieService } from 'ngx-cookie-service';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { UsuariosistemaComponent } from './componentes/usuariosistema/usuariosistema.component';
import { CrearusuariosistemaComponent } from './componentes/crearusuariosistema/crearusuariosistema.component';
import { MiperfilComponent } from './componentes/miperfil/miperfil.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthModule } from '@auth0/auth0-angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormatounoComponent } from './componentes/formatouno/formatouno.component';
import { FormatodosComponent } from './componentes/formatodos/formatodos.component';
import { ListaformatosComponent } from './componentes/listaformatos/listaformatos.component';
import { FormatounoverComponent } from './componentes/formatounover/formatounover.component';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import {
  MsalModule,
  MsalRedirectComponent,
  MsalGuard
} from '@azure/msal-angular';

import {
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';
import { CrearcontratoComponent } from './componentes/crearcontrato/crearcontrato.component';
import { VercontratoComponent } from './componentes/vercontrato/vercontrato.component';
import { FormatoseisComponent } from './componentes/formatoseis/formatoseis.component';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'f00fd17f-5bc3-4ac5-974e-10cac136be33',
    authority: 'https://login.microsoftonline.com/a988ccd4-00ed-4bf3-a4d1-b5661f44abdf',
    redirectUri: 'http://localhost:4200'
    //redirectUri: 'https://educaciononline.uta.edu.ec/apps/formatos/'
    //https://portal.azure.com/?ocid=AIDcmmvcssag76_SEM__k_Cj0KCQiAyvHLBhDlARIsAHxl6xoI6KMzW-WCWRedxycxxclUWx5RGJJFz_MPzqKJAPBW6kwp0l061tIaAvRqEALw_wcB_k_&icid=free-search&feature.msaljs=true#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps
  //click en la aplicacion y luego en Authentication (Preview)
  }
});


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrincipalComponent,
    NavComponent,
    MenuComponent,
    UsuariosComponent,
UsuariosistemaComponent,
    CrearusuariosistemaComponent,

    MiperfilComponent,
     FormatounoComponent,
     FormatodosComponent,
     ListaformatosComponent,
     FormatounoverComponent,
     CrearcontratoComponent,
     VercontratoComponent,
     FormatoseisComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MsalModule.forRoot(
      msalInstance,
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read']
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map()
      }
    ),
  ],
  bootstrap: [AppComponent, MsalRedirectComponent], // 👈 CLAVE
  providers: [UsersService,CookieService,MsalService,
    MsalBroadcastService,MsalGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy, },
    ],



})
export class AppModule { }
