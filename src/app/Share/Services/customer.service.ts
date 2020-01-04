import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../Model/User';
import { MethodPayment } from '../Model/MethodPayment';
import { Action } from '../Model/Action';
import { Customer } from '../Model/Customer'
import { Observable } from 'rxjs';
import { Category } from '../Model/Category';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnInit {

  public HandlesErrors: Function;
  public customer: Customer;
 // public users: User[];
  public methodPayments: MethodPayment[];
  public allActions: Action[];
  public allCategories: Category[];

  constructor(private httpClient: HttpClient, private router: Router, private loginSerive: LoginService) {
    this.HandlesErrors = this.loginSerive.HandlesErrors;
  }

  ngOnInit() {
  }

  public getCustomer():Observable<Customer> {
    return this.httpClient.get<Customer>("moneyManager/customer");
  }

  initUsers() {
    this.httpClient.get<User[]>("moneyManager/customer/user").subscribe(
      (res) => {/* this.users = res */},
      (err) => { this.HandlesErrors(err) }
    )
  }

  initMethodPayments() {
    this.httpClient.get<MethodPayment[]>("moneyManager/customer/methodPayment").subscribe(
      (res) => { /*this.methodPayments = res*/ },
      (err) => { this.HandlesErrors(err) }
    )
  }

  getAllActions():Observable<Action[]> {
   return this.httpClient.get<Action[]>("moneyManager/customer/action");
  }

  public getCategories():Observable<Category[]>{
    return this.httpClient.get<Category[]>("moneyManager/customer/category");
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>("moneyManager/customer", customer);
  }

  public removeCustomer():Observable<void>{
    return this.httpClient.delete<void>("moneyManager/customer");
  }

  public addUser(user: User): Observable<User> {
    return this.httpClient.post<User>("moneyManager/customer/user", user);
  }

  public updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>("moneyManager/customer/user/", user);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>("moneyManager/customer/user/" + userId);
  }

  public getUserById(userId: number): Observable<User> {
    return this.httpClient.get<User>("moneyManager/customer/user/" + userId);
  }

  public addMethodPayment(mp: MethodPayment): Observable<MethodPayment> {
    return this.httpClient.post<MethodPayment>("moneyManager/customer/methodPayment", mp);
  }

  public updateMethodPayment(methodPayment: MethodPayment): Observable<MethodPayment> {
    return this.httpClient.put<MethodPayment>("moneyManager/customer/methodPayment", methodPayment);
  }

  public removeMethodPayment(methodPaymentId: number): Observable<void> {
    return this.httpClient.delete<void>("moneyManager/customer/methodPayment/" + methodPaymentId);
  }

  public getMethodPaymentById(methodPaymentId: number): Observable<MethodPayment> {
    return this.httpClient.get<MethodPayment>("moneyManager/customer/methodPayment/" + methodPaymentId);
  }

  public addAction(action: Action): Observable<Action> {
    return this.httpClient.post<Action>("moneyManager/customer/action", action);
  }

  public updateAction(action: Action): Observable<Action> {
    return this.httpClient.put<Action>("moneyManager/customer/action", action);
  }

  public removeAction(actionId: number): Observable<void> {
    return this.httpClient.delete<void>("moneyManager/customer/action/" + actionId);
  }

  public getActionById(actionId: number): Observable<Action> {
    return this.httpClient.get<Action>("moneyManager/customer/action/" + actionId);
  }
}