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

//Obtener datos del formato 1

obtenerDatosFormato1(codigo:number): Observable<any> {
  const objetoopciones = {

    //Debe coincidir con el index del backend
    fx:'getformato1PorCodigo',
    //Codigo del formato 1 que queremos consultar
    d:{
      formato1_codigo:codigo
    }
  };
  return this.http.post<any>(this.URL, objetoopciones);
}

//Guardara el formato 6
insertformato6(objetoopciones:any):Observable<any>{
  return this.http.post<any>(this.URL,objetoopciones);
}

//Obtener formato 6
obtenerFormato6(objetoopciones:any):Observable<any>{
  return this.http.post<any>(this.URL,objetoopciones);
}
//Obtiene el formato 6 para generar el reporte PDF
obtenerFormato6Reporte(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}

obtenerFormato1CursoDefinido(
  objetoopciones: any
): Observable<any> {

  return this.http.post<any>(
    this.URL,
    objetoopciones
  );

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
