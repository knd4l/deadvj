import { Component, OnInit } from '@angular/core';
import { ModulosService } from 'src/app/servicios/modulos.service';
import { HttpErrorResponse,HttpEventType,HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { FormulariosService } from 'src/app/servicios/formularios.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

@Component({
  selector: 'app-crearcontrato',
  templateUrl: './crearcontrato.component.html',
  styleUrls: ['./crearcontrato.component.css']
})
export class CrearcontratoComponent implements OnInit {
  tematicas: any = [];
  users: any = [];
  idtema:any;
  nombretema:any;
  totalpostulantes:any=0;

  formato1Form!: FormGroup;
  constructor(private fb: FormBuilder,private modulosrv: ModulosService) { }

  ngOnInit(): void {
    this.cargarTematicas();

  }

  cargarTematicas(){

    const data = {
      fx: 'verTodastematicas',
      d: {},
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    this.modulosrv.getModalidad(data).subscribe({

      next: (res:any) => {

        console.log("Respuesta completa:", res);

        this.tematicas = res.data.item || res.data || res;

        console.log("Tematicas:", this.tematicas);

      },

      error: (err: HttpErrorResponse) => {

        console.error("Error servidor:", err);

      }

    });

  }

  consultaporSeleccion(){
    var tematica=(<HTMLInputElement>document.getElementById("tematica")).value;
   alert(tematica);


  }

  guardarContrato(){}


}
