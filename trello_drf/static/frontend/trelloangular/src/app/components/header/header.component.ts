import { Component, OnInit, Input } from '@angular/core';
import { Board } from '../../models/boards';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InviteMemberService } from '../../services/inviteMember/invite-member.service';
import { LoginService } from '../../services/login/login.service';
import { MembersService } from '../../services/members/members.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Member } from '../../models/members';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
@Input() board: Board;
@Input() boardMembers: Member;

submitted = false;



InviteMemberForm: FormGroup = new FormGroup({
  email: new FormControl('', Validators.required)
});
get f() { return this.InviteMemberForm.controls; }
  constructor(private cookies: CookieService,
              private router: Router,
              private inviteService: InviteMemberService,
              private loginService: LoginService,
              private memberService: MembersService) { }

  ngOnInit() {
  }

  sendEmail(): void {
    this.submitted = true;
    if (this.InviteMemberForm.valid) {
      this.inviteService.sendEmail(this.InviteMemberForm.value.email, this.board).subscribe();
    }
  }

  logout(): void {
    this.loginService.logoutUser().subscribe(
      response => {
        this.cookies.deleteAll();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['']);
      }
    );
  }

  members() {
    this.memberService.members(this.board.id).subscribe(
      data => {
        this.boardMembers = data;
      }
    );
  }

}

