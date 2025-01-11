import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeEntrepriseComponent } from './employe/list-employe-entreprise/list-employe-entreprise.component';
import { ProfileComponent } from './profile/profile.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';




const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: ListEmployeEntrepriseComponent
  },
  { path: 'employes', component: ListEmployeEntrepriseComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'notifications', component: ListNotificationComponent },

  





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
