import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BoardsComponent } from './components/boards/boards.component';
import { CreateboardComponent } from './components/createboard/createboard.component';
import { BoarddetailComponent } from './components/boarddetail/boarddetail.component';
import { RegisterComponent } from './components/register/register.component';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';

const routes: Routes = [
                        {path: '', component: LoginComponent},
                        {path: 'register', component: RegisterComponent},
                        {path: 'boards', component: BoardsComponent},
                        {path: 'createboard', component: CreateboardComponent},
                        {path: 'board/:id', component: BoarddetailComponent},
                        {path: 'board/:id/:uuid', component: AcceptInviteComponent},
                        ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
