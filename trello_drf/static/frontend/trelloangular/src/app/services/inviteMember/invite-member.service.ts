import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InviteMemberService {

  constructor(private http: HttpClient) { }

  sendEmail(email, board) {
    const url = `/api/board/${board.id}/invite/`;
    const data = {email, board: board.id};
    return this.http.post(url, data);
  }
}
