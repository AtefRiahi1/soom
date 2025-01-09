import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeEntrepriseComponent } from './employe/list-employe-entreprise/list-employe-entreprise.component';




const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: ListEmployeEntrepriseComponent
  },
  { path: 'employes', component: ListEmployeEntrepriseComponent },

  





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
