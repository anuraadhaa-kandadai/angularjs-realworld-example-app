import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { AuthComponent } from './features/auth/auth.component';
import { ListErrorsComponent } from './shared/list-errors.component';
import { UserService } from './core/services/user.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderComponent,
    AuthComponent,
    ListErrorsComponent
  ],
  providers: [UserService]
})
export class AppModule { }