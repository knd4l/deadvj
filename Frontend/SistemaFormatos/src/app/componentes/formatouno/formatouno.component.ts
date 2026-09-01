import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModulosService } from 'src/app/servicios/modulos.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { FormulariosService } from 'src/app/servicios/formularios.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-formatouno',
  templateUrl: './formatouno.component.html',
  styleUrls: ['./formatouno.component.css']
})
export class FormatounoComponent implements OnInit {
  tipocapacitacion: any = [];
  modalidadcapacitacion: any = [];
  ipAddress: any;
  fecha: any;
  deviceInfo : DeviceInfo;
  navegador:any;

  codigocategoria:any;
  roles: any = [];
  formato1Form!: FormGroup;
  isGuardando: boolean = false;

  archivo: File | null = null;
  archivoguardar = '';
  rutaArchivoguardar = '';
  anio: any;
  archivoSubidoHV = false;


  archivo_crit: File | null = null;
  archivoguardar_crit = '';
  rutaArchivoguardarCrit = '';
  archivoSubido_crit = false;

  constructor(private fb: FormBuilder,private moduloService: ModulosService,public CookieService:CookieService,private formularioService: FormulariosService, private deviceService: DeviceDetectorService,private router:Router) { }

  ngOnInit(): void {
    this.cargarFechaHora();
    this.cargarTipoCapacitacion();
    this.cargarModalidadCapacitacion();
    this.getIP();
    this.formato1Form = this.fb.group({

      // ===== DATOS GENERALES =====
      tipocapacitacion: ['', Validators.required],
      institucion: ['', Validators.required],
      personacontacto: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      mesejecucion: ['', Validators.required],
      modalidad: ['', Validators.required],
      numeropersonas: ['', Validators.required],
      cargahoraria: ['', Validators.required],
      fechaejecucion: ['', Validators.required],
      inversion: ['', Validators.required],

      // ===== ARRAYS =====
      tematicas: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ]),

      instructores: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ]),

      // ===== ACTA (solo texto) =====
      actaTrabajo: [false],
      actaTrabajoTexto: [{ value: '', disabled: true }],
      

      // ===== ACUERDO (nombre archivo) =====
      acuerdoCalidad: [false],
      acuerdoCalidadFile: [{ value: '', disabled: true }],

      // ===== CRITERIO (nombre archivo) =====
      criterioCalificacion: [false],
      criterioCalificacionFile: [{ value: '', disabled: true }],

      // ===== CONSECUENCIAS =====
      consecuencia1: [''],
      consecuencia2: [''],
      consecuencia3: [''],
      docucapacitacion: ['']

    });



  // 3️⃣ Activar listeners de checkboxes
  this.controlarDocumentos();
  }

  categoriaSeleccionada(valor:any){
    this.codigocategoria=valor;

  }



  //PARA SUBIR ACUERDO DE CALIDAD
  seleccionarArchivo(event:any) {
    const file = event.target.files?.[0] as File | undefined;
    if (file?.type === 'application/pdf') {
      this.archivo = file;
      this.archivoSubidoHV = false;
      this.formato1Form.get('acuerdoCalidadFile')?.setValue(file.name);
    } else {
      this.archivo = null;
      this.formato1Form.get('acuerdoCalidadFile')?.setValue('');
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showDenyButton: true,
      showConfirmButton: false,
      text: 'El archivo debe ser en formato PDF!',
      denyButtonText: `Aceptar`
    });
    event.target.value = '';
  }
  }

  upload() {
    if (!this.archivo) {
      Swal.fire('Archivo requerido', 'Seleccione el PDF de Acuerdo de Calidad.', 'warning');
      return;
    }

    this.moduloService.uploadFile(this.archivo).subscribe(
      datos => {
        if (datos?.success && datos?.file?.path) {
          this.archivoguardar = datos.file.name;
          this.rutaArchivoguardar = datos.file.path;
          this.archivoSubidoHV = true;
        } else {
          Swal.fire('Error', datos?.message || 'No se pudo subir el archivo', 'error');
        }
      },
      error => {
        console.error(error);
        Swal.fire('Error', 'No se pudo subir el archivo', 'error');
      }
    );
  }



  //PARA SUBIR CRITERIO DE CALIDAD
  seleccionarArchivo_Crit(event:any) {
    const file = event.target.files?.[0] as File | undefined;
    if (file?.type === 'application/pdf') {
      this.archivo_crit = file;
      this.archivoSubido_crit = false;
      this.formato1Form.get('criterioCalificacionFile')?.setValue(file.name);
    } else {
      this.archivo_crit = null;
      this.formato1Form.get('criterioCalificacionFile')?.setValue('');
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showDenyButton: true,
      showConfirmButton: false,
      text: 'El archivo debe ser en formato PDF!',
      denyButtonText: `Aceptar`
    });
    event.target.value = '';
  }
  }

  upload_Crit() {
    if (!this.archivo_crit) {
      Swal.fire('Archivo requerido', 'Seleccione el PDF de Criterio de Calificación.', 'warning');
      return;
    }

    this.moduloService.uploadFile(this.archivo_crit).subscribe(
      datos => {
        if (datos?.success && datos?.file?.path) {
          this.archivoguardar_crit = datos.file.name;
          this.rutaArchivoguardarCrit = datos.file.path;
          this.archivoSubido_crit = true;
        } else {
          Swal.fire('Error', datos?.message || 'No se pudo subir el archivo', 'error');
        }
      },
      error => {
        console.error(error);
        Swal.fire('Error', 'No se pudo subir el archivo', 'error');
      }
    );
  }




  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      this.formato1Form.get(controlName)?.setValue(file);
    }
   // console.log(this.formato1Form);
  }


  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 🔥 SOLO EL NOMBRE, SIN fakepath
      this.formato1Form.get(controlName)?.setValue(file.name);
    }
  }


  validarArchivoRequerido() {
    return (form: FormGroup) => {

      const reglas = [
        ['actaTrabajo', 'actaTrabajoFile'],
        ['acuerdoCalidad', 'acuerdoCalidadFile'],
        ['criterioCalificacion', 'criterioCalificacionFile']
      ];

      for (let [check, file] of reglas) {
        if (form.get(check)?.value && !form.get(file)?.value) {
          return { archivoRequerido: true };
        }
      }

      return null;
    };
  }


  controlarDocumentos(): void {

    this.formato1Form.get('actaTrabajo')?.valueChanges.subscribe(valor => {
      const ctrl = this.formato1Form.get('actaTrabajoTexto');
      valor ? ctrl?.enable() : ctrl?.disable();
      this.formato1Form.updateValueAndValidity();
    });

    this.formato1Form.get('acuerdoCalidad')?.valueChanges.subscribe(valor => {
      const ctrl = this.formato1Form.get('acuerdoCalidadFile');
      valor ? ctrl?.enable() : ctrl?.disable();
      this.formato1Form.updateValueAndValidity();
    });

    this.formato1Form.get('criterioCalificacion')?.valueChanges.subscribe(valor => {
      const ctrl = this.formato1Form.get('criterioCalificacionFile');
      valor ? ctrl?.enable() : ctrl?.disable();
      this.formato1Form.updateValueAndValidity();
    });

  }


  validarDocumentos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const form = control as FormGroup;

      const acta = form.get('actaTrabajo')?.value;
      const actaTexto = form.get('actaTrabajoTexto')?.value;

      const acuerdo = form.get('acuerdoCalidad')?.value;
      const acuerdoFile = form.get('acuerdoCalidadFile')?.value;

      const criterio = form.get('criterioCalificacion')?.value;
      const criterioFile = form.get('criterioCalificacionFile')?.value;

      if (acta && !actaTexto) {
        return { actaRequerida: true };
      }

      if (acuerdo && !acuerdoFile) {
        return { acuerdoRequerido: true };
      }

      if (criterio && !criterioFile) {
        return { criterioRequerido: true };
      }

      return null;
    };
  }
  guardarprueba(): void {
    console.log(this.formato1Form.value);

  }



  guardarformato1(): void {
    if (this.isGuardando) {
      console.warn('Ya hay un guardado en progreso, aguardando...');
      return;
    }

    console.log('FORM VALUE:', this.formato1Form.value);
    console.log('RAW VALUE:', this.formato1Form.getRawValue());

    if (this.formato1Form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor complete todos los campos obligatorios'
      });
      this.formato1Form.markAllAsTouched();
      return;
    }

    this.isGuardando = true;

    const f = this.formato1Form.getRawValue(); // Obtener valores sin deshabilitados

    const tematicasTexto = (f.tematicas || [])
      .filter((t: string) => t && t.trim() !== '')
      .join(', ');

    const instructoresTexto = (f.instructores || [])
      .filter((i: string) => i && i.trim() !== '')
      .join(', ');

    const data = {
      fx: 'insertformato1',
      d: {
        fformato1_tipo_capacitacion: f.tipocapacitacion,
        fformato1_tipo_capacitacion_docum:f.docucapacitacion,
        fformato1_fecha_elaboracion: f.fechaejecucion,
        fformato1_institucion: f.institucion,
        fformato1_persona_contacto: f.personacontacto,
        fformato1_direccion: f.direccion,
        fformato1_telefono: f.telefono,
        fformato1_correo: f.correo,
        fformato1_tematicas: tematicasTexto,
        fformato1_mes_ejecucion: f.mesejecucion,
        fformato1_numero_personas: f.numeropersonas,
        fformato1_modalidad: f.modalidad,
        fformato1_carga_horaria: f.cargahoraria,
        fformato1_instructores_tentativos: instructoresTexto,
        fformato1_fecha_ejecucion: f.fechaejecucion,
        fformato1_inversion: f.inversion,
        fformato1_consecuencia1:f.consecuencia1,
        fformato1_consecuencia2:f.consecuencia2,
        fformato1_consecuencia3:f.consecuencia3,
        fformato1_acta_trabajo:f.actaTrabajoTexto,
        fformato1_anexo_acta_trabajo: f.actaTrabajo ? 'SI' : 'NO',
        fformato1_acuerdo_calidad: this.archivoguardar,
        fformato1_acuerdo_calidad_ruta: this.rutaArchivoguardar,
        fformato1_criterio_calidad: this.archivoguardar_crit,
        fformato1_criterio_calidad_ruta: this.rutaArchivoguardarCrit

      },
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    const cargas = [];
    if (this.archivo && !this.archivoSubidoHV) {
      cargas.push(this.moduloService.uploadFile(this.archivo));
    }
    if (this.archivo_crit && !this.archivoSubido_crit) {
      cargas.push(this.moduloService.uploadFile(this.archivo_crit));
    }

    forkJoin(cargas.length ? cargas : [of(null)]).subscribe({
      next: (archivos: any[]) => {
        let indice = 0;
        if (this.archivo && !this.archivoSubidoHV) {
          const respuesta = archivos[indice++];
          if (!respuesta?.success || !respuesta?.file?.path) {
            this.isGuardando = false;
            Swal.fire('Error', respuesta?.message || 'No se pudo subir el Acuerdo de Calidad.', 'error');
            return;
          }
          this.archivoguardar = respuesta.file.name;
          this.rutaArchivoguardar = respuesta.file.path;
          this.archivoSubidoHV = true;
        }
        if (this.archivo_crit && !this.archivoSubido_crit) {
          const respuesta = archivos[indice++];
          if (!respuesta?.success || !respuesta?.file?.path) {
            this.isGuardando = false;
            Swal.fire('Error', respuesta?.message || 'No se pudo subir el Criterio de Calificación.', 'error');
            return;
          }
          this.archivoguardar_crit = respuesta.file.name;
          this.rutaArchivoguardarCrit = respuesta.file.path;
          this.archivoSubido_crit = true;
        }

        data.d.fformato1_acuerdo_calidad = this.archivoguardar;
        data.d.fformato1_acuerdo_calidad_ruta = this.rutaArchivoguardar;
        data.d.fformato1_criterio_calidad = this.archivoguardar_crit;
        data.d.fformato1_criterio_calidad_ruta = this.rutaArchivoguardarCrit;
        this.insertarFormato1(data);
      },
      error: () => {
        this.isGuardando = false;
        Swal.fire('Error', 'No se pudieron subir los anexos.', 'error');
      }
    });
  }

  private insertarFormato1(data: any): void {
      this.moduloService.insertarFormato1(data).subscribe({
      next: (res: any) => {
        this.isGuardando = false;

        if (res?.data?.success && res.data.estado > 0) {

          const idInsertado = res.data.rcount;
          console.log('======= INICIANDO GUARDADO DE DATOS RELACIONADOS ======');
          console.log('ID del formato insertado:', idInsertado);

          forkJoin([
            this.guardarTematicasTentIngresadas(idInsertado),
            this.guardarInstructorTentIngresado(idInsertado),
            this.guardarConsecuenciasIngresadas(idInsertado)
          ]).subscribe({
            next: () => {
              console.log('======= TODOS LOS DATOS RELACIONADOS GUARDADOS =======');
              Swal.fire({
                icon: 'success',
                title: 'Guardado completado',
                text: 'Todos los datos se guardaron correctamente',
                timer: 2500,
                showConfirmButton: false
              });
              this.formato1Form.reset();
              this.archivo = null;
              this.archivo_crit = null;
              this.archivoguardar = '';
              this.rutaArchivoguardar = '';
              this.archivoguardar_crit = '';
              this.rutaArchivoguardarCrit = '';
              this.archivoSubidoHV = false;
              this.archivoSubido_crit = false;
              this.isGuardando = false;
            },
            error: (err) => {
              console.error('Error en guardado de datos relacionados:', err);
              this.isGuardando = false;
            }
          });
        } else {
          this.isGuardando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar la información'
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isGuardando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'No se pudo conectar con el servidor'
        });
        console.error(err);
      }
    });
  }


   cargarTipoCapacitacion(){

    let data: any;

		    data = {
		    fx: 'tipocapacitacion',
		    d: {},
		    dpro: 0,
		    dus: 0,
		    dcx: 1
		    };

		    this.moduloService.getCapacitacion(data).subscribe(
          res => {
		    let dataobj: any;
		    dataobj = res;


		    if (dataobj.data.success && dataobj.data.estado > 0)
		    {
				"se ejecuto bien hacer algo aqui";
        this.tipocapacitacion=dataobj.data.item;
       // (this.facultades);
		    }else{
"se ejecuto mal hacer algo aqui"
		  	}

		  }, (err: HttpErrorResponse) => {
		   	  "error general hacer algo aqui no llamo al servidor o un error grave en el servidor"
		   if (err.error instanceof Error) {

		   } else {

		   }
		  }
		);
  }

  cargarModalidadCapacitacion(){

    let data: any;

		    data = {
		    fx: 'modalidadcapacitacion',
		    d: {},
		    dpro: 0,
		    dus: 0,
		    dcx: 1
		    };

		    this.moduloService.getModalidad(data).subscribe(
          res => {
		    let dataobj: any;
		    dataobj = res;


		    if (dataobj.data.success && dataobj.data.estado > 0)
		    {
				"se ejecuto bien hacer algo aqui";
        this.modalidadcapacitacion=dataobj.data.item;
       // (this.facultades);
		    }else{
"se ejecuto mal hacer algo aqui"
		  	}

		  }, (err: HttpErrorResponse) => {
		   	  "error general hacer algo aqui no llamo al servidor o un error grave en el servidor"
		   if (err.error instanceof Error) {

		   } else {

		   }
		  }
		);
  }

  get tematicas() {
    return this.formato1Form.get('tematicas') as FormArray;
  }

  get instructores() {
    return this.formato1Form.get('instructores') as FormArray;
  }

  guardarTematicasTent(temanombre: string, codigof1: any) {

    const data = {
      fx: 'inserttemtentativas',
      d: {
        ftematicat_nombre: temanombre,
        ftematicat_codigof1: codigof1
      },
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    return this.moduloService.insertarTemTentativ(data).pipe(
      catchError(err => {
        console.error('Error al guardar temática', err);
        return of(null);
      })
    );
  }
  guardarTematicasTentIngresadas(codigoform1: any) {

    const tematicas = this.tematicas.value
      .filter((t: string) => t && t.trim() !== '');

    console.log('TEMÁTICAS A GUARDAR:', tematicas);
    console.log('CANTIDAD DE TEMÁTICAS:', tematicas.length);

    if (tematicas.length === 0) {
      return of([]);
    }

    const requests = tematicas.map((tema: string, index: number) => {
      console.log(`Guardando temática ${index + 1}/${tematicas.length}: "${tema}"`);
      return this.guardarTematicasTent(tema, codigoform1);
    });

    return forkJoin(requests);
  }


  guardarInstructorTent(instnombre: string, codigof1: any) {

    const data = {
      fx: 'insertinsttentativas',
      d: {
        finstructorest_nombre: instnombre,
        finstructorest_codigof1: codigof1
      },
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    return this.moduloService.insertarInstTentativ(data).pipe(
      catchError(err => {
        console.error('Error al guardar instructor', err);
        return of(null);
      })
    );
  }

  guardarInstructorTentIngresado(codigoform1: any) {

    const instructores = this.instructores.value
      .filter((i: string) => i && i.trim() !== '');

    console.log('INSTRUCTORES A GUARDAR:', instructores);
    console.log('CANTIDAD DE INSTRUCTORES:', instructores.length);

    if (instructores.length === 0) {
      return of([]);
    }

    const requests = instructores.map((inst: string, index: number) => {
      console.log(`Guardando instructor ${index + 1}/${instructores.length}: "${inst}"`);
      return this.guardarInstructorTent(inst, codigoform1);
    });

    return forkJoin(requests);
  }

  guardarConsecuenciaTexto(consecuencia: string, codigof1: any) {
    const data = {
      fx: 'insertconsecuencia',
      d: {
        fconsecuencia_descripcion: consecuencia,
        fconsecuencia_formato1_codigo: codigof1
      },
      dpro: 0,
      dus: 0,
      dcx: 1
    };

    return this.moduloService.insertarConsecuencia(data).pipe(
      catchError(err => {
        console.error('Error al guardar consecuencia', err);
        return of(null);
      })
    );
  }

  guardarConsecuenciasIngresadas(codigoform1: any) {
    const consecuencias = [
      this.formato1Form.get('consecuencia1')?.value,
      this.formato1Form.get('consecuencia2')?.value,
      this.formato1Form.get('consecuencia3')?.value
    ].filter((c: string | null) => c && c.trim() !== '');

    console.log('CONSECUENCIAS A GUARDAR:', consecuencias);
    console.log('CANTIDAD DE CONSECUENCIAS:', consecuencias.length);

    if (consecuencias.length === 0) {
      return of([]);
    }

    const requests = consecuencias.map((consecuencia: string, index: number) => {
      console.log(`Guardando consecuencia ${index + 1}/${consecuencias.length}: "${consecuencia}"`);
      return this.guardarConsecuenciaTexto(consecuencia, codigoform1);
    });

    return forkJoin(requests);
  }

  getIP()
  {
    this.formularioService.getIPAddress().subscribe((res:any)=>{
      this.ipAddress=res.ip;
    });
  }

  cargarFechaHora() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    var d = dd.toString();
    var m = mm.toString();
    if (dd < 10) {
      d = '0' + dd;
    }
    if (mm < 10) {
      m = '0' + mm;
    }
    var h = yyyy + '-' + m + '-' + d;
    var ho = hoy.getHours();
    var mi = hoy.getMinutes();
  var seg=hoy.getSeconds();
    var hos = ho.toString();
    var mis = mi.toString();
  var segu = seg.toString();
    if (ho < 10) {
      hos = '0' + hos;
    }
    if (mi < 10) {
      mis = '0' + mis;
    }
  if (seg < 10) {
    segu = '0' + seg;
    }
    var hora = hos + ':' + mis + ':00';

    //(<HTMLInputElement>document.getElementById("txt_fechasol")).value = h;
    //2023-04-25 11:48:24
  this.fecha=h+' '+hora;
  this.anio=dd+'_'+mm+'_'+yyyy;



  }


}
