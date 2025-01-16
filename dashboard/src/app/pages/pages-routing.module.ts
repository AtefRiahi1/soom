import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeEntrepriseComponent } from './employe/list-employe-entreprise/list-employe-entreprise.component';
import { ProfileComponent } from './profile/profile.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListModuleEmployeByEmployeComponent } from './list-module-employe-by-employe/list-module-employe-by-employe.component';
import { ListModuleEmployeEntrepriseComponent } from './list-module-employe-entreprise/list-module-employe-entreprise.component';
import { ListEntrepriseComponent } from './list-entreprise/list-entreprise.component';
import { ListEmployeAdminComponent } from './employe/list-employe-admin/list-employe-admin.component';
import { ListModuleComponent } from './list-module/list-module.component';




const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: ListEmployeEntrepriseComponent
  },
  { path: 'employes', component: ListEmployeEntrepriseComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'notifications', component: ListNotificationComponent },
  { path: 'modules/:idemp', component: ListModuleEmployeByEmployeComponent },
  { path: 'modules', component: ListModuleEmployeEntrepriseComponent },
  { path: 'entreprises', component: ListEntrepriseComponent },
  { path: 'employes/:ident', component: ListEmployeAdminComponent },
  { path: 'modulesadmin', component: ListModuleComponent },

  





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
