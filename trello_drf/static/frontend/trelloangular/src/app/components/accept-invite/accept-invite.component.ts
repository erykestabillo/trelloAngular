import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members/members.service';


@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.css']
})
export class AcceptInviteComponent implements OnInit {

  constructor(private router: ActivatedRoute,private r: Router, private memberService: MembersService) { }

  ngOnInit() {
    
  }

  accept() {
    const boardId = +this.router.snapshot.paramMap.get('id');
    this.memberService.acceptInvite(boardId).subscribe();
    this.r.navigate([`board/${boardId}`]);

  }



}
