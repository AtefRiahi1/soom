import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgStepperModule } from 'angular-ng-stepper';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';




import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ListEmployeEntrepriseComponent } from './employe/list-employe-entreprise/list-employe-entreprise.component';
import { ProfileComponent } from './profile/profile.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListModuleEmployeByEmployeComponent } from './list-module-employe-by-employe/list-module-employe-by-employe.component';
import { ListModuleEmployeEntrepriseComponent } from './list-module-employe-entreprise/list-module-employe-entreprise.component';
import { ListEntrepriseComponent } from './list-entreprise/list-entreprise.component';
import { ListEmployeAdminComponent } from './employe/list-employe-admin/list-employe-admin.component';
import { ListModuleComponent } from './list-module/list-module.component';
import { ListSessionEmployeComponent } from './list-session-employe/list-session-employe.component';
import { ClientComponent } from './client/client.component';
import { ClientMapComponent } from './client-map/client-map.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { FournisseurMapComponent } from './fournisseur-map/fournisseur-map.component';
import { MouvementComponent } from './mouvement/mouvement.component';
import { ArticleComponent } from './article/article.component';
import { AchatComponent } from './achat/achat.component';
import { VenteComponent } from './vente/vente.component';
import { CommandeAchatComponent } from './commande-achat/commande-achat.component';
import { ComachatfileComponent } from './comachatfile/comachatfile.component';
import { FactureAchatComponent } from './facture-achat/facture-achat.component';
import { FacachatfileComponent } from './facachatfile/facachatfile.component';


@NgModule({
  declarations: [

  
    SignInComponent,
         SignUpComponent,
         ListEmployeEntrepriseComponent,
         ProfileComponent,
         ListNotificationComponent,
         ListModuleEmployeByEmployeComponent,
         ListModuleEmployeEntrepriseComponent,
         ListEntrepriseComponent,
         ListEmployeAdminComponent,
         ListModuleComponent,
         ListSessionEmployeComponent,
         ClientComponent,
         ClientMapComponent,
         FournisseurComponent,
         FournisseurMapComponent,
         MouvementComponent,
         ArticleComponent,
         AchatComponent,
         VenteComponent,
         CommandeAchatComponent,
         ComachatfileComponent,
         FactureAchatComponent,
         FacachatfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxExtendedPdfViewerModule,
    NgStepperModule,
    HttpClientModule,
    CdkStepperModule,
    UIModule,

    NgxExtendedPdfViewerModule,
    BsDatepickerModule,
    WidgetModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule,
    NgxPaginationModule
  ],
})
export class PagesModule { }
