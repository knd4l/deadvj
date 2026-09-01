import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaformatosComponent } from './listaformatos.component';

describe('ListaformatosComponent', () => {
  let component: ListaformatosComponent;
  let fixture: ComponentFixture<ListaformatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaformatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaformatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
