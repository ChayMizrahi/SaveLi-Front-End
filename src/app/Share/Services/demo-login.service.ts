import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../Model/login';
import { Router } from "@angular/router";
import { Customer } from '../Model/Customer';
import { Observable } from 'rxjs';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { Action } from '../Model/Action';
import { MethodPayment } from '../Model/MethodPayment';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class DemoLoginService {

  public isLoggedIn: boolean;
  public loginType: string = 'GUEST';

  /** יכיל את מערך כל הלקוחות הרשומים במערכת */
  public allCustomers: Customer[];
  /** יכיל את כ  המיילים הרשומים במערכת לצורך אימות שאין כפילות מיילים */
  public allEmails: string[];
  /** יכיל את ההודעה שתוצג ללקוח כאשר המייל או הסיסמא שהזין אינם נכונים */
  public invalidLoginMessage: string = "";
  /** יכיל את המספר האחרון שניתן כמזהה של לקוח */
  public countCustomersId: number;
  /** יכיל את המספר האחרון שניתן כמזהה של משתמש */
  public countUsersId: number;

  public allActions:Action[];

  constructor(private httpClient: HttpClient, private router: Router) {
    this.initAllCustomers(); 
    this.initAllActions();
  }

  ngOnInit() {
  }

  /** הפונקציה מאתחלת את השדה כל הלקוחות ברשימת כל הלקוחות שמופיע בג'יסון */
  initAllCustomers() {
    this.getAllCustomers().subscribe(
      (res) => {
        this.allCustomers = res;
        this.initAllEmails();
        this.initCountCustomerId();
        this.initCountUsersId();
     
      },
      (err) => { this.HandlesErrors(err) }
    )
  }



  /**
   * הפוקנציה מקבלת פרטי התחברות הכוללים אמייל וסיסמה ובודקת האם קיים משתמש ברשימת כל המשתמשים שהאמייל והסיסמה שלו תואמים לאלו שהתקבלו.
   * במידה וכן, הפונקציה תיצור לוקל-סטורג' שיכיל את המזהה של הלקוח שפרטיו התקבלו ותחזיר אמת.
   * אחרת היא תחזיר שקר.
   * @param login - חייב לכלול אמייל וסיסמה.
   */
  public preformLogin(login: Login): boolean {
    let ans: boolean = false;
    this.allCustomers.forEach(customer => {
      if (customer.email == login.email && customer.password == login.password) {
        localStorage.setItem('customerId', customer.id.toString());
        ans = true;
      }
    })
    return ans;
  }

  /** הפונקציה מוחקת את האחסון מקומי שמכיל את המזהה של הלקוח המחובר */
  public preformLogout(): boolean {
    localStorage.removeItem('customerId');
    return true;
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

  public registation(customer: Customer): boolean {
    // מגדיר את המזה של הלקוח לפי המזהה האחרון שניתן
    customer.id = this.countCustomersId + 1;
    // מוסיף אחד לספירת המזהים של הלקוחות
    this.countCustomersId += 1;
    // מגדיר את המזהה של המשתמש הראשון של הלקוח החדש על פי ספירת המזהים של משתמשים
    customer.users[0].id = this.countUsersId + 1;
    // מוסיף אחד לספירת המשתמשים
    this.countUsersId += 1;
    customer.methodPayments = [];
    // מוסיף את הלקוח שהתקבל אל רשימת כל הלקוחות
    this.allCustomers.unshift(customer);
    localStorage.setItem('customerId', customer.id.toString())
    console.log(customer)
    return true;
  }

  public initAllActions(){
    this.getAllActions().subscribe(
      (res)=>{this.allActions = res},
      (err)=>{this.HandlesErrors(err)}
    )
  }

  public initAllEmails() {
    this.allEmails = [];
    this.allCustomers.forEach(c => {
    this.allEmails.unshift(c.email);
    });
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
      this.router.navigate(["/login"])
    }
    console.log(error);
  }

  initCountCustomerId() {
    this.countCustomersId =  this.allCustomers.sort((a,b)=>{return a.id - b.id})[this.allCustomers.length-1].id
  }

  initCountUsersId() {
    let allUsers:User[] = [];
    this.allCustomers.forEach(customer=>{
      customer.users.forEach(u=>{
        allUsers.unshift(u);
      })
    })
    this.countUsersId =  allUsers.sort((a,b)=>{return a.id - b.id})[allUsers.length-1].id
  }



  getAllCustomers():Observable<Customer[]>{
    return this.httpClient.get<Customer[]>("assets/json/allCustomers.json");
  }

  getAllActions():Observable<Action[]>{
    return this.httpClient.get<Action[]>("assets/json/allActions.json");
  }

}