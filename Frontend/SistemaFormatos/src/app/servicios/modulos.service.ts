import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
 URL = "http://localhost/practicas/Backend/srvformatos/index.php";
 URLfile = "http://localhost/practicas/Backend/srvformatos/DocumentosPostulacion/";

  constructor(private http: HttpClient) { }

  getCapacitacion(objetoopciones: any): Observable<any> {
    return this.http.post<any>(this.URL, objetoopciones);
}

getModalidad(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
insertarFormato1(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
insertarTemTentativ(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}

// Envía los datos del curso definido al servicio PHP.
insertarCursoDefinido(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
insertarInstTentativ(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
insertarConsecuencia(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
uploadFile(archivo:any) {
  const data = new FormData();
  data.append('archivo', archivo);
  return this.http.post<any>(`${this.URLfile}subirArchivo.php`, data);
}
}
