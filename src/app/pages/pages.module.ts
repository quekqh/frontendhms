import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { AdminModule } from './admin/admin.module';
import { HomeModule } from './home/home.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    CommonModule,
    AdminModule,
    HomeModule,
    LayoutModule,
  ],
  declarations: [],
  providers: [],
})
export class PagesModule {}
