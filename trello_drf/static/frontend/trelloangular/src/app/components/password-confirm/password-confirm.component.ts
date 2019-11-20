import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordConfirmService } from '../../services/password-confirm/password-confirm.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.css']
})
export class PasswordConfirmComponent implements OnInit {

  ResetForm: FormGroup = this.formBuilder.group({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  }, {validator: this.passwordMatch('password', 'confirmPassword')});

  get f() { return this.ResetForm.controls; }
  submitted = false;
  uid = '';
  token = '';
  
  constructor(private formBuilder: FormBuilder,
              private passwordConfirmService: PasswordConfirmService,
              private router: ActivatedRoute,
              ) { }

  ngOnInit() {
    this.router.paramMap.subscribe((params) => {
       this.uid = params.get('uid');
       this.token = params.get('token');
  });

  }

  passwordMatch(controlName: string, matchingControlName: string) {
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
    };
  }

  resetPassword() {
    this.submitted = true;
   
    if (this.ResetForm.valid) {
      
      this.passwordConfirmService.passwordReset(this.uid,
                                                this.token,
                                                this.ResetForm.value.password,
                                                this.ResetForm.value.confirmPassword).subscribe(
                                                  data => {
                                                    console.log(data);
                                                  }
                                                ), error => {
                                                  
                                                };

    }


  }


}
