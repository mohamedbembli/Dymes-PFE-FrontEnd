import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderLifeCycleStepComponent } from './dialog-order-life-cycle-step.component';

describe('DialogOrderLifeCycleStepComponent', () => {
  let component: DialogOrderLifeCycleStepComponent;
  let fixture: ComponentFixture<DialogOrderLifeCycleStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOrderLifeCycleStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderLifeCycleStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
