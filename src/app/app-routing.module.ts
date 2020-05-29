import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminMainViewComponent } from './admin-main-view/admin-main-view.component';
import { ManageHandbookComponent } from './manage-handbook/manage-handbook.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'admin-main-view/:id', component: AdminMainViewComponent},
  {path: 'manage-handbook/:id', component: ManageHandbookComponent},
  {path: 'admin-profile/:id', component: AdminProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
