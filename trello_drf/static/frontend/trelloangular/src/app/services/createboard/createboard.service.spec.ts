import { TestBed } from '@angular/core/testing';

import { CreateboardService } from './createboard.service';

describe('CreateboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateboardService = TestBed.get(CreateboardService);
    expect(service).toBeTruthy();
  });
});
