import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateboardService {
  createBoardUrl = '/api/boards/';
  constructor(private http: HttpClient) { }

  createBoard(title): Observable<any> {
    const boardData = {title};
    return this.http.post(this.createBoardUrl, boardData);
  }
}
