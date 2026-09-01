import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { UsersService } from 'src/app/servicios/users.service';
import * as pdfMake from 'pdfmake/build/pdfmake';

import { FormatounoverComponent } from './formatounover.component';

describe('FormatounoverComponent', () => {
  let component: FormatounoverComponent;
  let fixture: ComponentFixture<FormatounoverComponent>;
  let userService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UsersService', ['getFormato1Reporte']);

    await TestBed.configureTestingModule({
      declarations: [FormatounoverComponent],
      providers: [
        { provide: UsersService, useValue: userService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatounoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build and open a PDF when report is returned', () => {
    const pdfSpy = spyOn(pdfMake, 'createPdf').and.returnValue({
      open: jasmine.createSpy('open')
    } as any);

    userService.getFormato1Reporte.and.returnValue(of({
      data: {
        item: [{
          formato1_codigo: 12,
          tipo_capac_nombre: 'Capacitación',
          formato1_institucion: 'Institución X',
          formato1_persona_contacto: 'Ana',
          formato1_direccion: 'Calle 1',
          formato1_telefono: '0999999999',
          formato1_correo: 'ana@mail.com',
          formato1_tematicas: 'Tema 1',
          formato1_mes_ejecucion: 'Agosto',
          formato1_numero_personas: '20',
          modalidad_nombre: 'Virtual',
          formato1_carga_horaria: '10',
          formato1_instructores_tentativos: 'Luis',
          formato1_fecha_ejecucion: '2026-08-30',
          formato1_inversion: '1000',
          formato1_estado: 'Activo'
        }]
      }
    }));

    component.verFormularioPDF(12);

    expect(userService.getFormato1Reporte).toHaveBeenCalled();
    expect(pdfSpy).toHaveBeenCalled();
  });
});
