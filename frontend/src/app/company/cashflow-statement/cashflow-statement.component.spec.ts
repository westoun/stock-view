import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowStatementComponent } from './cashflow-statement.component';

describe('CashflowStatementComponent', () => {
  let component: CashflowStatementComponent;
  let fixture: ComponentFixture<CashflowStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashflowStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
