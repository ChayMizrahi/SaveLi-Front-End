import { Injectable, OnInit, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../Model/User';
import { MethodPayment } from '../Model/MethodPayment';
import { Action } from '../Model/Action';
import { Customer } from '../Model/Customer'
import { Observable, from, Subscriber, Observer, observable } from 'rxjs';
import { Category } from '../Model/Category';
import { LoginService } from './login.service';
import { DemoLoginService } from './demo-login.service';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})

export class DemoCustomerServiceService {

  /** פונקציה שמטפלת בשגיאות שנזרקות כתוצרה מפניה לשרת */
  public HandlesErrors: Function;
  /** מכיל את כל הלקוחות שנרשמו לאפליקציה */
  public allCustomers: Customer[];
  /** כל הפעולות קיימות בבסיס הנתונים */
  public allTheActionsInTheDB: Action[];
  /** מכיל את פרטי הלקוח שמחובר */
  public customer: Customer;
  /** המחובר מכיל את כל הפעולות ששייכות של הלקוח */
  public allActions: Action[];
  /** מכיל את כל הקטגוריות שקיימות בבסיס הנתונים */
  public allCategories: Category[];
  /** מכיל את המזהה האחרון שניתן לפעולה */
  public countActionsId: number;
  /** מכיל את המזהה האחרון שניתן לאמצעי תשלום */
  public countMethodPaymentId: number;
  /** מכיל את המזהה האחרון שניתן למשתמש */
  public countUsersId: number;

  constructor(private httpClient: HttpClient, private router: Router, private loginSerive: DemoLoginService) {
    this.HandlesErrors = this.loginSerive.HandlesErrors;
    // יאתחל את האובייקט מכיל את המזהה האחרון שניתן לפעולה.
    this.initAllCustomers();
    this.initAllActions();

  }

  ngOnInit() {
   
  }

  getAllCustomers(): Observable<Customer[]> {
    if(this.loginSerive.allCustomers != null){
      let customers = Observable.create((observer: Observer<Customer[]>) => {
        setTimeout(() => {
          observer.next(this.loginSerive.allCustomers);
        }, 100);
      });
      return customers;
    }else{
      return this.httpClient.get<Customer[]>("assets/json/allCustomers.json");
    }
    
  }

  getAllTheAction(): Observable<Action[]> {
    return this.httpClient.get<Action[]>("assets/json/allActions.json");
  }

  /**
   * הפוקנציה מחזירה צופה של הלקוח שהמזהה שלו מאופסן באחסון המקומי.
   * כדי שהפונקציה תעבוד היא חייבת לקבל את מערך כל הלקוחות שרשומים בתוכנה.
   */
  public getCustomer(allCustomers: Customer[]): Observable<Customer> {
    let c: Customer;
    // לוקח את המזהה של הלקוח שביצע התחברות מהאחסון המקומי.
    let theId: number = Number(localStorage.getItem('customerId'))
    allCustomers.forEach(customer => {
      if (customer.id == theId) {
        c = customer
      }
    })
    if (c != null) {
      const theCustomer = Observable.create((observer: Observer<Customer>) => {
        setTimeout(() => {
          observer.next(c);
        }, 100);
      });
      return theCustomer;
    } else {
      this.allActions = null;
      this.allCategories = null;
      this.customer = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loginType");
      this.loginSerive.checkLoggedInAndInitLoginType();
      this.router.navigate(["/login"]);
    }

  }

  /**
   * הפונקציה מחזירה את מערך הפעולות שרשומות על שמו של הלקוח שמחובר.
   * @param theCustomer הלקוח המחובר.
   * @param allActions כל הפעולות שהתקבלו מהשרת.
   */
  public getAllActionsOftheCustomer(theCustomer: Customer, allActions: Action[]): Observable<Action[]> {
    this.allActions = [];
    allActions.forEach(action => {
      theCustomer.methodPayments.forEach(mp => {
        if (action.methodPayment.id == mp.id) {
          this.allActions.push(action);
        }
      })
    });
    let actions = Observable.create((observer: Observer<Action[]>) => {
      setTimeout(() => {
        observer.next(this.allActions);
      }, 100);
    });
    return actions;
  }

  public getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>("assets/json/allCategories.json");
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    this.customer = customer;
    let observerCustomer = Observable.create((observer: Observer<Customer>) => {
      setTimeout(() => {
        observer.next(customer);
      }, 100);
    });
    return observerCustomer;
  }

  public removeCustomer(): Observable<void> {
    let observerCustomer = Observable.create((observer: Observer<void>) => {
      setTimeout(() => {
        observer.next();
      }, 100);
    });
    return observerCustomer;
  }

  public addUser(user: User): Observable<User> {
    user.id = this.countUsersId + 1;
    this.countUsersId =  this.countUsersId + 1;
    const doneUser = Observable.create((observer: Observer<User>) => {
      setTimeout(() => {
        observer.next(user);
      }, 100);
    });
    return doneUser;
  }

  public updateUser(user: User): Observable<User> {
    this.allActions.forEach(action => {
      if (action.user.id == user.id) {
        action.user = user;
      }
    })
    let observer = Observable.create((observer: Observer<User>) => {
      setTimeout(() => {
        observer.next(user);
      }, 100);
    });
    return observer;
  }


  public deleteUser(userId: number): Observable<void> {
    let observer = Observable.create((observer: Observer<void>) => {
      setTimeout(() => {
        observer.next();
      }, 100);
    });
    return observer;
  }



  public addMethodPayment(mp: MethodPayment): Observable<MethodPayment> {
    mp.id = Number(this.countMethodPaymentId + 1);
    this.countMethodPaymentId += 1;
    const methodPayment = Observable.create((observer: Observer<MethodPayment>) => {
      setTimeout(() => {
        observer.next(mp);
      }, 500);
    });
    return methodPayment;
  }

  public updateMethodPayment(methodPayment: MethodPayment): Observable<MethodPayment> {
    this.allActions.forEach(action => {
      if (action.methodPayment.id == methodPayment.id) {
        action.methodPayment = methodPayment;
      }
    })
    let observer = Observable.create((observer: Observer<MethodPayment>) => {
      setTimeout(() => {
        observer.next(methodPayment);
      }, 100);
    });
    return observer;
  }

  public removeMethodPayment(methodPaymentId: number): Observable<void> {
    let observer = Observable.create((observer: Observer<void>) => {
      setTimeout(() => {
        observer.next();
      }, 100);
    });
    return observer;
  }

  public addAction(action: Action): Observable<Action> {
    action.amount = Number(action.amount);
    action.id = this.countActionsId + 1;
    this.countActionsId += 1;
    this.loginSerive.allActions.push(action);
    const doneAction = Observable.create((observer: Observer<Action>) => {
      setTimeout(() => {

        observer.next(action);
      }, 500);
    });
    return doneAction;
  }

  public updateAction(action: Action): Observable<Action> {
    let observer = Observable.create((observer: Observer<Action>) => {
      setTimeout(() => {
        observer.next(action);
      }, 100);
    });
    return observer;
  }

  public removeAction(actionId: number): Observable<void> {
    for (let i: number = 0; i < this.loginSerive.allActions.length; i++) {
      let action: Action = this.loginSerive.allActions[i];
      if (action.id == actionId) {
        this.loginSerive.allActions.splice(i, 1);
      }
    }
    let observer = Observable.create((observer: Observer<void>) => {
      setTimeout(() => {
        observer.next();
      }, 100);
    });
    return observer;
  }
  
  initAllCustomers(){
    console.log('1')
    if(this.loginSerive.allCustomers == null){
      this.getAllCustomers().subscribe(
        (res)=>{this.loginSerive.allCustomers = res;
        this.allCustomers = res;
        this.initCountMethodPaymentId();
        this.initCountUsersId();
      },
      (err)=>{this.HandlesErrors(err)}
      )
    }else{
      this.allCustomers = this.loginSerive.allCustomers;
      this.initCountMethodPaymentId();
      this.initCountUsersId();
    }
  }

  initAllActions(){
    if(this.loginSerive.allActions == null){
      this.loginSerive.getAllActions().subscribe(
      (res)=>{
        this.loginSerive.allActions = res;
        this.allTheActionsInTheDB = this.loginSerive.allActions;
        this.initCountActionsId();
      },
      (err)=>{
        this.HandlesErrors(err);
      }
      )
    }else{
      this.allTheActionsInTheDB = this.loginSerive.allActions;
      this.initCountActionsId();
    }
  }


  /**
   * הפוקנציה פונה על קובץ שמכיל את כל הפעולות שמתועדות ממיימנת אותןם על פי המזהה ולוקחת את המזהה הגבוהה ביותר.
   * בו היא מאתחל את המשתנה שמכיל את הספירה של המזהים
   */
  initCountActionsId() {
    // ניסיון
    if(this.loginSerive.allActions != null){
      this.countActionsId = this.loginSerive.allActions.sort((a, b) => { return a.id - b.id })[this.loginSerive.allActions.length - 1].id
    }else{
      // עד לפה
      this.httpClient.get<Action[]>("assets/json/allActions.json").subscribe(
        (res) => { this.countActionsId = res.sort((a, b) => { return a.id - b.id })[res.length - 1].id },
        (err) => { this.HandlesErrors(err) }
      )
    }
  
  }

  /**
   * הפוקנציה חייבת לפעול רק אחרי נערכה בדיקה שבשרת ההתחברות האובייקט שמכיל את כל הלקוחות לא ריק.
   * הפונקציה לוקח את כל אמצעי התשלום של כל הלקוחות ולוקחת מהם את המזהה הגבוה ביותר,
   * בו היא מאתחלת את האובייקט שסופר את המזהים של אמצעי התשלום.
   */
  initCountMethodPaymentId() {
    let allMp: MethodPayment[] = [];
    this.loginSerive.allCustomers.forEach(c => {
      c.methodPayments.forEach(mp => {
        allMp.push(mp);
      })
    })
    this.countMethodPaymentId = allMp.sort((a, b) => { return a.id - b.id })[allMp.length - 1].id;
  }

  /**
   * הפוקנציה חייבת לפעול רק אחרי נערכה בדיקה שבשרת ההתחברות האובייקט שמכיל את כל הלקוחות לא ריק.
   * הפונקציה לוקח את כל המשתמשים של כל הלקוחות ולוקחת מהם את המזהה הגבוה ביותר,
   * בו היא מאתחלת את האובייקט שסופר את המזהים של המשתמשים.
   */
  initCountUsersId() {
    let allUser: User[] = [];
    this.loginSerive.allCustomers.forEach(c => {
      c.users.forEach(u => {
        allUser.push(u);
      })
    })
    this.countUsersId = allUser.sort((a, b) => { return a.id - b.id })[allUser.length - 1].id;
  }



}
