import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './GuestComponents/login/login.component';
import { MainComponent } from './components/main/main.component';
import { CustomerHomeComponent } from './CustomerComponents/customer-home/customer-home.component';
import { BalanceTableComponent } from './CustomerComponents/balance-table/balance-table.component';
import { MethodPaymentComponent } from './CustomerComponents/method-payment/method-payment.component';

import { RegistrationComponent } from './GuestComponents/registration/registration.component';
import { GetAllUsersComponent } from './CustomerComponents/get-all-users/get-all-users.component';
import { AddExpenseComponent } from './CustomerComponents/add-expense/add-expense.component';
import { AddIncomeComponent } from './CustomerComponents/add-income/add-income.component';
import { GetActionsComponent } from './CustomerComponents/get-actions/get-actions.component';
import { CustomersComponent } from './AdminComponents/customers/customers.component';
import { CategoriesComponent } from './AdminComponents/categories/categories.component';
import { MonthlySummaryComponent } from './CustomerComponents/monthly-summary/monthly-summary.component';
import { CustomerSettingComponent } from './CustomerComponents/customer-setting/customer-setting.component';
import { SumMonthComponent } from './CustomerComponents/monthly-summary/sum-month/sum-month.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: "", component: MainComponent },
  {path: '404', component: NotFoundComponent},
  { path: "home", component: MainComponent },
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  {path:"customerHome", component:CustomerHomeComponent},
  // { path: "customerHome", component: CustomerHomeComponent },
  { path: "addExpense", component: AddExpenseComponent },
  { path: "addIncome", component: AddIncomeComponent },
  //{ path: "balanceTable/:year/:month", component: BalanceTableComponent },
  { path: "summary", component: MonthlySummaryComponent },
  { path: "summary/:year/:month/:by", component: SumMonthComponent },
  { path: "methodPayment", component: MethodPaymentComponent },
  { path: "user", component: GetAllUsersComponent },
  { path: "action/:type/:id/:year/:month/:by", component: GetActionsComponent },
  { path: "customers", component: CustomersComponent },
  { path: "categories", component: CategoriesComponent },
  { path: 'settings', component: CustomerSettingComponent },
   {path: '**', redirectTo: '/404'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }