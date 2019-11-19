import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(email, username, password) {
    const url = '/api/register/';
    const data = {email, username, password};
    return this.http.post(url, data);
  }
}
