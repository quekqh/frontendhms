import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LayoutModule } from '../layout/layout.module';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

import { LoginComponent } from './login/login.component';
import { AppointmentComponent } from './appointment/appointment.component';

import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    CalendarModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    NgxIntlTelInputModule,
    BsDropdownModule,
    LayoutModule,
  ],
  declarations: [AppointmentComponent, LoginComponent],
  providers: [],
})
export class HomeModule {}
