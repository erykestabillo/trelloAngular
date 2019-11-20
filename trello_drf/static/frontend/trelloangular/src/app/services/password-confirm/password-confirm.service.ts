import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordConfirmService {

  constructor(private http: HttpClient) { }

  passwordReset(uid, token, new_password1, new_password2) {
    const url = `/rest-auth/password/reset/confirm/`;
    const data = {token, uid, new_password1, new_password2};
    return this.http.post(url, data);
  }
}
