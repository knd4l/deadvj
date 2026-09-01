import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {
URL = "https://deadv.uta.edu.ec/posgrados/srvformularios/index.php";
URLmosh = "https://posgrados.uta.edu.ec/posgrados/execmoodle.php";
//URL = "http://localhost/srvformularios/index.php";

  constructor(private http: HttpClient) { }

getRoles(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}


public getIPAddress(){
  return this.http.get("https://api.ipify.org/?format=json");
}
InsertLog(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
cambiarContrasena(objetoopciones: any): Observable<any> {
  return this.http.post<any>(this.URL, objetoopciones);
}
}
