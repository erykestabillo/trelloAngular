import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BoardsComponent } from './components/boards/boards.component';
import { CreateboardComponent } from './components/createboard/createboard.component';
import { BoarddetailComponent } from './components/boarddetail/boarddetail.component';
import { RegisterComponent } from './components/register/register.component';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';
import { NopermissionComponent } from './components/nopermission/nopermission.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordConfirmComponent } from './components/password-confirm/password-confirm.component';

const routes: Routes = [
                        {path: '', component: LoginComponent},
                        {path: 'register', component: RegisterComponent},
                        {path: 'reset', component: PasswordResetComponent},
                        {path: 'reset/:uid/:token', component: PasswordConfirmComponent},
                        {path: 'boards', component: BoardsComponent},
                        {path: 'createboard', component: CreateboardComponent},
                        {path: 'board/:id', component: BoarddetailComponent},
                        {path: 'board/:id/:uuid', component: AcceptInviteComponent},
                        {path: 'error', component: NopermissionComponent},
                        ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
