import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcfAnalysisComponent } from './dcf-analysis.component';

describe('DcfAnalysisComponent', () => {
  let component: DcfAnalysisComponent;
  let fixture: ComponentFixture<DcfAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcfAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcfAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
