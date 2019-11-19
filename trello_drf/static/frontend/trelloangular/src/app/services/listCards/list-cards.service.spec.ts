import { TestBed } from '@angular/core/testing';

import { ListCardsService } from './list-cards.service';

describe('ListCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListCardsService = TestBed.get(ListCardsService);
    expect(service).toBeTruthy();
  });
});
