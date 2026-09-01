import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearcontratoComponent } from './crearcontrato.component';

describe('CrearcontratoComponent', () => {
  let component: CrearcontratoComponent;
  let fixture: ComponentFixture<CrearcontratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearcontratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearcontratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
