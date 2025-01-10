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


@NgModule({
  declarations: [

  
    SignInComponent,
         SignUpComponent,
         ListEmployeEntrepriseComponent,
         ProfileComponent
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
