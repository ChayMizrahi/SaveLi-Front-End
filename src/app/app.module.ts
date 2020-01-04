import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {  
  PlatformLocation,  
  Location,  
  LocationStrategy,  
  HashLocationStrategy,  
  PathLocationStrategy,  
  APP_BASE_HREF}  
from '@angular/common';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


import { AppRoutingModule } from './app-routing.module';

import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './GuestComponents/login/login.component';
import { CustomerHomeComponent } from './CustomerComponents/customer-home/customer-home.component';
import { BalanceTableComponent } from './CustomerComponents/balance-table/balance-table.component';
import { MethodPaymentComponent } from './CustomerComponents/method-payment/method-payment.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { RegistrationComponent } from './GuestComponents/registration/registration.component';
import { GetAllUsersComponent } from './CustomerComponents/get-all-users/get-all-users.component';
import { AddExpenseComponent } from './CustomerComponents/add-expense/add-expense.component';
import { AddIncomeComponent } from './CustomerComponents/add-income/add-income.component';
import { GetActionsComponent } from './CustomerComponents/get-actions/get-actions.component';
import { AdminHomeComponent } from './AdminComponents/admin-home/admin-home.component';
import { CustomersComponent } from './AdminComponents/customers/customers.component';
import { CategoriesComponent } from './AdminComponents/categories/categories.component';
import { GuestHomeComponent } from './GuestComponents/guest-home/guest-home.component';
import { from } from 'rxjs';
import { MonthlySummaryComponent } from './CustomerComponents/monthly-summary/monthly-summary.component';
import { CustomerSettingComponent } from './CustomerComponents/customer-setting/customer-setting.component';
import { MpComponent } from './CustomerComponents/method-payment/mp/mp.component';
import { SumMonthComponent } from './CustomerComponents/monthly-summary/sum-month/sum-month.component';
import { NotFoundComponent } from './not-found/not-found.component';




@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    MainComponent,
    LoginComponent,
    CustomerHomeComponent,
    BalanceTableComponent,
    MethodPaymentComponent,
    RegistrationComponent,
    GetAllUsersComponent,
    AddExpenseComponent,
    AddIncomeComponent,
    GetActionsComponent,
    AdminHomeComponent,
    CustomersComponent,
    CategoriesComponent,
    GuestHomeComponent,
    MonthlySummaryComponent,
    CustomerSettingComponent,
    MpComponent,
    SumMonthComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    GoogleChartsModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
