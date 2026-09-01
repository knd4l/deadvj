import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LoginComponent } from "./componentes/login/login.component";
import { PrincipalComponent } from './componentes/principal/principal.component';
import { UsuariosComponent } from "./componentes/usuarios/usuarios.component";
import { CrearusuariosistemaComponent } from './componentes/crearusuariosistema/crearusuariosistema.component';
import { UsuariosistemaComponent } from './componentes/usuariosistema/usuariosistema.component';
import { VigilanteGuard } from './vigilante.guard';
import { MiperfilComponent } from './componentes/miperfil/miperfil.component';
import { FormatounoComponent } from './componentes/formatouno/formatouno.component';
import { FormatounoverComponent } from './componentes/formatounover/formatounover.component';
import { CrearcontratoComponent } from './componentes/crearcontrato/crearcontrato.component';
import { VercontratoComponent } from './componentes/vercontrato/vercontrato.component';

const routes: Routes = [
{path:'',pathMatch:'full', redirectTo:'login'},
{path:'login', component:LoginComponent},
{path:'principal', component:PrincipalComponent,canActivate: [VigilanteGuard]},
{path:'miperfil', component:MiperfilComponent,canActivate: [VigilanteGuard]},
{path:'usuarios', component:UsuariosComponent,canActivate: [VigilanteGuard]},
{path:'formatouno', component:FormatounoComponent,canActivate: [VigilanteGuard]},
{path:'verformatouno', component:FormatounoverComponent,canActivate: [VigilanteGuard]},
{path:'crearusuariosistema', component:CrearusuariosistemaComponent,canActivate: [VigilanteGuard]},
{path:'usuariosistema', component:UsuariosistemaComponent,canActivate: [VigilanteGuard]},
{path:'crearcontrato', component:CrearcontratoComponent,canActivate: [VigilanteGuard]},
{path:'vercontrato', component:VercontratoComponent,canActivate: [VigilanteGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule,],
  providers: [ HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
