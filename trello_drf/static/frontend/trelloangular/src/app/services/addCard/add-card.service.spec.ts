import { TestBed } from '@angular/core/testing';

import { AddCardService } from './add-card.service';

describe('AddCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddCardService = TestBed.get(AddCardService);
    expect(service).toBeTruthy();
  });
});
