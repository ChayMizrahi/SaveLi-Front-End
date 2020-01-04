import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/Share/Model/login';
import { LoginService } from 'src/app/Share/Services/login.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /** The field contain the customer login details */
  public theLogin: Login = new Login();
  /** The field that indicating if the password / email is incorrect */
  public invalidLogin: boolean = false;

  /**
   * The constuctor of the class.
   * Indenpendent injection loginService and Router.
   * @param loginService - allow as to use in the function of loginService. 
   * @param router - allow us to move the user between router.
   */
  constructor(public loginService: DemoLoginService, private router: Router, private customerService: DemoCustomerServiceService) { }

  ngOnInit() {
  }

  // התחברות כשאני משתמש בשרת מדומה

  // הפונקציה מדמה התחברות למערכת.
  public login() {
    // מגדיר בהתחלה שההתחברות תקינה 
    this.invalidLogin = false;
    if(this.loginService.preformLogin(this.theLogin)){
      // אם פרטי ההתחברות נכונים מייצר לוקל סורג' חדשים ומעביר לעמוד הבית
      localStorage.setItem("isLoggedIn", 'true');
      localStorage.setItem("loginType", 'CUSTOMER');
      this.router.navigate(["home"])
    }else{
      this.invalidLogin = true;
    }
  }
  

/** 
  // התחברות כשאני משתמש בשרת אמיתי
  public login() {
    this.invalidLogin = false;
    The email contain admin ? 
    if (this.theLogin.email.toLocaleLowerCase().indexOf('admin') >= 0) {
      this.theLogin.loginType = 'ADMIN';
    } else {
      this.theLogin.loginType = 'CUSTOMER'
    }
    this.loginService.preformLogin(this.theLogin).subscribe(
      (res) => {
        if (res) {
          localStorage.setItem("isLoggedIn", 'true');
          localStorage.setItem("loginType", this.theLogin.loginType);
          this.router.navigate(["home"])
        } else {
          this.invalidLogin = true;
        }
      },
      (err) => { this.loginService.HandlesErrors(err) }
    )
  }
  **/
  

}
