import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../Model/login';
import { Router } from "@angular/router";
import { Customer } from '../Model/Customer';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit {

  public isLoggedIn: boolean;
  public allEmails: string[];
  public loginType: string = 'GUEST';
  public allCustomers:Customer[];


  public invalidLoginMessage: string = "";


  constructor(private httpClient: HttpClient, private router: Router) {
    this.initAllEmails();
    
  }

  ngOnInit() {
  }


  public preformLogin(login: Login): Observable<boolean> {
    return this.httpClient.post<boolean>("login?email=" + login.email + "&password=" + login.password + "&loginType=" + login.loginType, login);
  }



 public preformLogout():Observable<boolean> {
  return this.httpClient.post<boolean>("logout", null);
}

  checkLoggedInAndInitLoginType() {
    if (localStorage.getItem("isLoggedIn") == "true") {
      this.isLoggedIn = true;
      this.loginType = localStorage.getItem("loginType");
    } else {
      this.isLoggedIn = false;
      this.loginType = null;
      this.router.navigate(["/home"])
    }
  }

  public registation(customer: Customer): Observable<boolean> {
    return this.httpClient.post<boolean>("registration", customer);
  }

  public initAllEmails() {
    this.httpClient.get<string[]>("email").subscribe(
      (res) => { this.allEmails = res },
      (err) => { this.HandlesErrors(err) }
    )
  }

  public HandlesErrors(error: HttpErrorResponse) {
    if (error.status == 401) {
      localStorage.removeItem('loginType');
      localStorage.removeItem('isLoggedIn');
      this.loginType = "GUEST";
      this.router.navigate(["/home"])
    }
    if (error.status == 0) {
      alert("יש בעיה אנא פנה למנהל");
    }
    if (error.status == 404) {
      alert("יש בעיה אנא פנה למנהל");
      localStorage.removeItem('loginType');
      localStorage.removeItem('isLoggedIn');
      this.checkLoggedInAndInitLoginType();
      this.router.navigate(["/login"])
    }
    console.log(error);
  }

}
