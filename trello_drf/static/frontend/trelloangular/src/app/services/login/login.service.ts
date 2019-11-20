import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginUrl:string = '/api/login/';

  constructor(private http: HttpClient) { }

  loginUser(username, password): Observable <any> {
    const loginData = {username, password};
    return this.http.post(this.loginUrl, loginData);
  }

  logoutUser() {
    const url = '/api/logout/';
    return this.http.get(url);
  }
}
