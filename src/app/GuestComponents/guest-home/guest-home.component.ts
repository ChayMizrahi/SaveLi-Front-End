import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';
import { Login } from 'src/app/Share/Model/login';

@Component({
  selector: 'app-guest-home',
  templateUrl: './guest-home.component.html',
  styleUrls: ['./guest-home.component.css']
})
export class GuestHomeComponent implements OnInit {


  constructor(private router: Router, public loginService: DemoLoginService) {
  }

  ngOnInit() {
  }

  // הפונקציה מדמה התחברות למערכת.
  public login(email: string, password: string) {
    let theLogin: Login = new Login();
    theLogin.email = email;
    theLogin.password = password;
    theLogin.loginType = 'CUSTOMER';
    if (this.loginService.preformLogin(theLogin)) {
      // אם פרטי ההתחברות נכונים מייצר לוקל סורג' חדשים ומעביר לעמוד הבית
      localStorage.setItem("isLoggedIn", 'true');
      localStorage.setItem("loginType", 'CUSTOMER');
      this.loginService.loginType = "CUSTOMER";
      this.router.navigate(["customerHome"])
    }
  }


  moveToLoginPage() {
    this.router.navigate(['/login']);
  }

  moveToRegistrationPage() {
    this.router.navigate(['/registration']);
  }

}
