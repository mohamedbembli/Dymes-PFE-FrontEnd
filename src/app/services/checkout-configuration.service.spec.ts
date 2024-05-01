import { TestBed } from '@angular/core/testing';

import { CheckoutConfigurationService } from './checkout-configuration.service';

describe('CheckoutConfigurationService', () => {
  let service: CheckoutConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
