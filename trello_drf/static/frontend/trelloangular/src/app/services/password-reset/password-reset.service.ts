import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor(private http: HttpClient) { }

  reset(email) {
    const url = `rest-auth/password/reset/`;
    return this.http.post(url, {email});
  
  }
}


