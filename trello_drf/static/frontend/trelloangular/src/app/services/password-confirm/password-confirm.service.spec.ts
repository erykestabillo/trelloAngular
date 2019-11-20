import { TestBed } from '@angular/core/testing';

import { PasswordConfirmService } from './password-confirm.service';

describe('PasswordConfirmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordConfirmService = TestBed.get(PasswordConfirmService);
    expect(service).toBeTruthy();
  });
});
