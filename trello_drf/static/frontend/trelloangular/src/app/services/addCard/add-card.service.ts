import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddCardService {

  constructor(private http: HttpClient) { }

  addCard(board, title, boardList): Observable<any> {
    const cardUrl = `/api/${board}/${boardList}/card/`;
    const cardData = {title, board_list: boardList};
    return this.http.post(cardUrl, cardData);
  }

  editList(title,board, boardList): Observable<any> {
    const listUrl = '/api/board/list/' + boardList + '/edit/';
    const listData = {title, board};
    return this.http.put(listUrl, listData);
  }

}
