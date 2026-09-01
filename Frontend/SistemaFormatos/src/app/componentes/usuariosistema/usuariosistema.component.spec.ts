import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosistemaComponent } from './usuariosistema.component';

describe('UsuariosistemaComponent', () => {
  let component: UsuariosistemaComponent;
  let fixture: ComponentFixture<UsuariosistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosistemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
