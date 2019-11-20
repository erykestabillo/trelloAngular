import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  boardsUrl:string = '/api/boards/';

  constructor(private http: HttpClient) { }

  boardList(): Observable<any> {
    return this.http.get(this.boardsUrl);
  }

  editBoard(title, boardId): Observable<any> {
    const url = `/api/board/${boardId}/`;
    const data = {title};
    return this.http.put(url, data);
  }

  deleteBoard(boardId): Observable<any> {
    const url = `/api/board/${boardId}/`;
    return this.http.delete(url);
  }
}
