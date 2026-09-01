import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from "ngx-cookie-service";

import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
//URL = "https://deadv.uta.edu.ec/apps/postulaciones/trabajaconnosotros/srvencuestas/index.php";
URL = "http://localhost/practicas/Backend/srvformatos/index.php";
 URLmosh = "https://posgrados.uta.edu.ec/posgrados/execmoodle.php";
  constructor(private http: HttpClient, private cookies: CookieService) { }

  getListaFormatos1(objetoopciones: any): Observable<any> {
    return this.http.post<any>(this.URL, objetoopciones);
}
getFormato1Reporte(objetoopciones: any): Observable<any> {
    return this.http.post<any>(this.URL, objetoopciones);
}
getUsuariosId(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
guardarUsuario(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
actualizarUsuarios(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
guardarRolesPermisos(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
actualizarRolesPermisos(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
buscarUsuarioMoodle(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
guardarUsuarioMoodle(objetoopciones: any): Observable<any> {
  return this.http.get<any>(this.URLmosh +"?cadena="+objetoopciones,{});
}
getUsuarioCedula(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
getUsuarioCorreo(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
getUsuarioLogin(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
getUsuarioLogeado(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
getPalabra(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
deleteRolesPermisos(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}

}
