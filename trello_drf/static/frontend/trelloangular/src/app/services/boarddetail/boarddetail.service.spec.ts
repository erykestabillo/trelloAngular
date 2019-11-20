import { TestBed } from '@angular/core/testing';

import { BoarddetailService } from './boarddetail.service';

describe('BoarddetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoarddetailService = TestBed.get(BoarddetailService);
    expect(service).toBeTruthy();
  });
});
