import { TestBed } from '@angular/core/testing';

import { InviteMemberService } from './invite-member.service';

describe('InviteMemberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InviteMemberService = TestBed.get(InviteMemberService);
    expect(service).toBeTruthy();
  });
});
