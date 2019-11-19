import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoarddetailService {
  boardDetailUrl:string = '/api/board/';
  

  constructor(private http: HttpClient) { }

  boardDetail(boardId: number): Observable<any> {
    let tempUrl = this.boardDetailUrl + boardId + '/';
    console.log(tempUrl,"detail-url");
    return this.http.get(tempUrl);
  }

  addList(title, board): Observable<any> {
    const listUrl = '/api/board/' + board.id + '/list/';
    const listData = {title, board: board.id};
    return this.http.post(listUrl, listData);
  }

}
