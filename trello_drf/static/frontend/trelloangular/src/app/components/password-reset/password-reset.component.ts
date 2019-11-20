import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordResetService } from '../../services/password-reset/password-reset.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  ResetForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required)
  });
  submitted = false;
  get f() {return this.ResetForm.controls; }
  constructor(private passwordResetService: PasswordResetService,
              private modalService: NgbModal,
              private router: Router
              ) { }

  ngOnInit() {
  }

  reset() {
    if (this.ResetForm.valid) {
      this.passwordResetService.reset(this.ResetForm.value.email).subscribe();
      
    }
  }

  open(content) {
    if (this.ResetForm.valid) {
      this.modalService.open(content);
    }
  }

  redirect() {
    this.modalService.dismissAll();
    this.router.navigate(['']);
  }

}

  
