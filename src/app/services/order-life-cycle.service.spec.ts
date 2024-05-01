import { TestBed } from '@angular/core/testing';

import { OrderLifeCycleService } from './order-life-cycle.service';

describe('OrderLifeCycleService', () => {
  let service: OrderLifeCycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderLifeCycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
