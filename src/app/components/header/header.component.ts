import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getMonthInHebrewByNumber } from 'src/app/Share/Functions/GetMonthByDate';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  public isAdmin: boolean;
  public getMonthByNumber: Function = getMonthInHebrewByNumber;

  constructor(private router: Router, public loginService: DemoLoginService, private customerService: DemoCustomerServiceService) {
  }

  ngOnInit() {
    this.loginService.checkLoggedInAndInitLoginType();
  }

  public moveToLoginPage() {
    this.router.navigate(["/login"])
  }

  public moveToAddExpense() {
    this.router.navigate(["/addExpense"]);
  }

  public moveToAddIncome() {
    this.router.navigate(["/addIncome"]);
  }

  moveToBalenceTableByMonthAndDate(year: number, month: number) {
    this.router.navigate(["balanceTable/" + year + "/" + month]);
  }

  // התנתקות בשרת מדומה
  public preformLogout() {
    if (this.loginService.preformLogout()) {
      if (localStorage.getItem('loginType') == "CUSTOMER") {
        this.customerService.allActions = null;
        this.customerService.allCategories = null;
        this.customerService.customer = null;
      }
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loginType");
      this.loginService.checkLoggedInAndInitLoginType();
      this.router.navigate(["/login"]);
    }
  }


  /**
    // ביצוע התנתקות כשיש שרת אמיתי
    public preformLogout() {
      this.loginService.preformLogout().subscribe(
        (res) => {
          if (res) {
            if(localStorage.getItem('loginType') == "CUSTOMER"){
              this.customerService.allActions = null;
              this.customerService.allCategories = null;
              this.customerService.customer = null;
            }
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loginType");          
            this.loginService.checkLoggedInAndInitLoginType();
            this.router.navigate(["/login"]);
          }
        },
        (err) => (this.loginService.HandlesErrors(err))
      )
    }
     */

}
