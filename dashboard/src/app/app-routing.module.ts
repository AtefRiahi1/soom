import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { AuthGuard } from './core/guards/auth.guard';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ListApplicationComponent } from './layouts/list-application/list-application.component';


const routes: Routes = [

  // tslint:disable-next-line: max-line-length
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard]},
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule) , canActivate: [AuthGuard]},
  //{ path: 'crypto-ico-landing', component: CyptolandingComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'applications', component: ListApplicationComponent },

  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
