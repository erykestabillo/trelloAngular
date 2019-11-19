import { TestBed } from '@angular/core/testing';

import { BoardListService } from './board-list.service';

describe('BoardListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardListService = TestBed.get(BoardListService);
    expect(service).toBeTruthy();
  });
});
