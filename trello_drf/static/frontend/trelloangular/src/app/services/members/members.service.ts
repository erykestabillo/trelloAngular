import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) { }

  acceptInvite(boardId) {
    const url = `/api/board/${boardId}/accept/`;
    const data = {board: boardId};
    
    return this.http.post(url, data);
  }

  members(boardId): Observable<any> {
    const url = `/api/board/${boardId}/members/`;
    return this.http.get(url);
  }
}
