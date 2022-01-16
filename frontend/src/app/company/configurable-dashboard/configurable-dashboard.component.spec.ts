import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableDashboardComponent } from './configurable-dashboard.component';

describe('ConfigurableDashboardComponent', () => {
  let component: ConfigurableDashboardComponent;
  let fixture: ComponentFixture<ConfigurableDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurableDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
