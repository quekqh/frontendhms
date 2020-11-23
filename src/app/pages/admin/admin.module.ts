import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '../layout/layout.module';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    LayoutModule,
  ],
  declarations: [LoginComponent, DashboardComponent],
  providers: [],
})
export class AdminModule {}
