import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardListService {
  boardListUrl = '/api/board/';
  constructor(private http: HttpClient) { }
  boardList(boardId: number): Observable<any> {
    const tempUrl = this.boardListUrl + boardId + '/list/';
    return this.http.get(tempUrl);
  }

  deleteList(list_id): Observable<any> {
    const url = `/api/board/list/delete/${list_id}/`;
    return this.http.delete(url);
  }
}
