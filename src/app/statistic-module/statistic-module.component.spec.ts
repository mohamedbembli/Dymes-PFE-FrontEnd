import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticModuleComponent } from './statistic-module.component';

describe('StatisticModuleComponent', () => {
  let component: StatisticModuleComponent;
  let fixture: ComponentFixture<StatisticModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
