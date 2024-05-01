import { TestBed } from '@angular/core/testing';

import { AuthentificationClientGuardGuard } from './authentification-client-guard.guard';

describe('AuthentificationClientGuardGuard', () => {
  let guard: AuthentificationClientGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthentificationClientGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
