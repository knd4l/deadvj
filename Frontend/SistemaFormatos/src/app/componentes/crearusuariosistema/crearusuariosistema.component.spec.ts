import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearusuariosistemaComponent } from './crearusuariosistema.component';

describe('CrearusuariosistemaComponent', () => {
  let component: CrearusuariosistemaComponent;
  let fixture: ComponentFixture<CrearusuariosistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearusuariosistemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearusuariosistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
