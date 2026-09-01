import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseisComponent } from './formatoseis.component';

describe('FormatoseisComponent', () => {
  let component: FormatoseisComponent;
  let fixture: ComponentFixture<FormatoseisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatoseisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
