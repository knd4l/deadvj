import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseisverComponent } from './formatoseisver.component';

describe('FormatoseisverComponent', () => {
  let component: FormatoseisverComponent;
  let fixture: ComponentFixture<FormatoseisverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatoseisverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseisverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
