import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatounoComponent } from './formatouno.component';

describe('FormatounoComponent', () => {
  let component: FormatounoComponent;
  let fixture: ComponentFixture<FormatounoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatounoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatounoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
