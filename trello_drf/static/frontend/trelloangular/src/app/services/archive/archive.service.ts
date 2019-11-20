import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private http: HttpClient) { }

  archiveList(boardId): Observable<any> {
    const url = `/api/${boardId}/list/card/archives/`;
    return this.http.get(url);
  }

  archiveCard(title, boardList, cardId): Observable<any> {
    const url = `/api/board/list/${cardId}/archive/`;
    const data = {title, board_list: boardList, is_archived: 'true'};
    return this.http.put(url, data);
}

restoreCard(title, boardList, cardId): Observable <any> {
  const url = `/api/board/list/${cardId}/archive/restore/`;
  const data = {title, board_list: boardList, is_archived: 'false'};
  return this.http.put(url, data);

}
}
