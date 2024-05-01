import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLifeCycleComponent } from './order-life-cycle.component';

describe('OrderLifeCycleComponent', () => {
  let component: OrderLifeCycleComponent;
  let fixture: ComponentFixture<OrderLifeCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLifeCycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLifeCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
