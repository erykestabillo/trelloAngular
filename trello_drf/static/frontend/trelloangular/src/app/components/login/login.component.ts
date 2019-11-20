import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {
    form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  submitted = false;
  get f() { return this.form.controls; }

  constructor(private http: HttpClient, private router: Router, private login: LoginService) { }

  ngOnInit() {

  }

  loginUser(): void {
    this.submitted = true;
    console.log(this.submitted)
    if (this.form.valid) {
      this.login.loginUser(this.form.value.username, this.form.value.password).subscribe(
        token => {
          localStorage.setItem('Authorization', String(token));
          this.router.navigate(['boards']);
      });
    }
  }

}
