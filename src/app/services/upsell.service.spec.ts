import { TestBed } from '@angular/core/testing';

import { UpsellService } from './upsell.service';

describe('UpsellService', () => {
  let service: UpsellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpsellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
