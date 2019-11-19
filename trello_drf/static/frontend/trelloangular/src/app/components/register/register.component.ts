import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  UserForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(private regService: RegisterService) {}

  ngOnInit() {
  }

  register(): void {
    this.regService.register(this.UserForm.value.email,
                             this.UserForm.value.username,
                             this.UserForm.value.password).subscribe();
  }

}
