import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairPeCalculatorComponent } from './fair-pe-calculator.component';

describe('FairPeCalculatorComponent', () => {
  let component: FairPeCalculatorComponent;
  let fixture: ComponentFixture<FairPeCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FairPeCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FairPeCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
