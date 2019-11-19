import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register/register.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  UserForm: FormGroup = this.formBuilder.group({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  }, {validator: this.passwordMatch('password', 'confirmPassword')});

  submitted = false;
  constructor(private regService: RegisterService,
              private formBuilder: FormBuilder,
              private router: Router) {}


  get f() { return this.UserForm.controls; }

  ngOnInit() {

  }

  register(): void {
    this.submitted = true;
    if (this.UserForm.valid) {
      this.regService.register(this.UserForm.value.email,
      this.UserForm.value.username,
      this.UserForm.value.password).subscribe();
      this.router.navigate(['']);
    }

  }

  passwordMatch(controlName: string, matchingControlName: string) {
    console.log("passwordmatcher")
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.passwordMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ passwordMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

}
