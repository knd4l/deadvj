import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatodosComponent } from './formatodos.component';

describe('FormatodosComponent', () => {
  let component: FormatodosComponent;
  let fixture: ComponentFixture<FormatodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatodosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
