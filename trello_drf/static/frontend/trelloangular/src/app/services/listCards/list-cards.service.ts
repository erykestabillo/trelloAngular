import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Card } from '../../models/cards';

@Injectable({
  providedIn: 'root'
})
export class ListCardsService {

  constructor(private http: HttpClient) { }
  

  cardList(boardId, listId): Observable<any> {
    let cardListUrl = `/api/${boardId}/${listId}/card/`;
    return this.http.get(cardListUrl);
  }

  cardDrag(card_title,prev_list, new_list, card_id): Observable<any> {
    const url = `/api/board/${prev_list}/${card_id}/`;
    const cardData = {title: card_title, board_list: new_list};
    return this.http.put(url, cardData);
  }
  cardUpdate(title, prev_list,card_id, index): Observable<any> {
    const url = `/api/board/${prev_list}/${card_id}/index/`;
    const cardData = {title, board_list: prev_list, index: `0.${index}`};
    return this.http.put(url, cardData);
  }

  cardEdit(title, boardList, card_id): Observable<any> {
    const url = `/api/board/${boardList}/${card_id}/`;
    const cardData = {title, board_list: boardList};
    return this.http.put(url, cardData);
  }

  cardDelete(card_id): Observable<any> {
    const url = `/api/board/list/${card_id}/delete/`;
    return this.http.delete(url);

  }


  cardsDataSource : Card;

  updateCards(cardData){
    this.cardsDataSource = {} as Card;
    this.cardsDataSource = cardData;
    
  }


}
