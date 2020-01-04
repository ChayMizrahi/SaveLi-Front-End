import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { Router } from '@angular/router';
import { clickOnEntity, showState } from 'src/app/Share/animation';
import { Action } from 'src/app/Share/Model/Action';
import { Customer } from 'src/app/Share/Model/Customer';
import { IfStmt } from '@angular/compiler';
import { displayDateHebrow } from 'src/app/Share/Functions/DisplayDate';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';


@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css'],
  animations: [
    clickOnEntity,
    showState
  ]
})
export class CustomerHomeComponent implements OnInit {

  public hour = new Date().getHours();
  public allActions: Action[];
  public byDebit: boolean = true;
  public problem: boolean = false;
  public makeUpdate: number = -1;
  public actionToUpdate: Action;
  public recentActions: Action[];
  public actionThisMonth: boolean = false;
  public displayDateHebrow: Function = displayDateHebrow;
  public columnChartByDebit;
  public columnChartByAction;
  public options = {
    legend: { position: 'none' },
    backgroundColor: { fill: 'transparent' },
    forceIFrame: 'true'
  }

  constructor(public myService: DemoCustomerServiceService, private router: Router) {
    myService.initAllCustomers();
    myService.initAllActions();
  }

  ngOnInit() {
    this.initData();
  }

  moveToMethodPaymentPage() {
    this.router.navigate(["/methodPayment"])
  }

  initRecentActions(actions: Action[]) {
    let recentActions: Action[] = actions.slice();
    recentActions.sort((a, b) => { return b.id - a.id });
    this.recentActions = recentActions.slice(0, 5);;
  }

  deleteAction(id: number, index: number) {
    let res: boolean = confirm("האם ברצונך למחוק את הפעולה?");
    if (res) {
      this.myService.removeAction(id).subscribe(
        (res) => {
          for (let index = 0; index < this.myService.allActions.length; index++) {
            const element = this.myService.allActions[index];
            if (element.id == id) {
              this.allActions.splice(index, 1);
            }
            this.actionThisMonth = this.hasActionsByActionDateThisMonth();
            if (this.actionThisMonth == true) {
              this.initColumnChartByDebit();
              this.initColumnChartByAction();
            }
          }
          this.initRecentActions(this.myService.allActions);
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  moveToExpensePage() {
    this.router.navigate(['addExpense']);
  }

  moveToIncomePage() {
    this.router.navigate(['addIncome']);
  }

  moveToUserPage() {
    this.router.navigate(['user']);
  }

  initColumnChartByDebit() {
    let thisMonth = new Date().getMonth() + 1;
    let thisYear = new Date().getFullYear();
    let actionData: Action[] = this.allActions.slice();
    let incomes: number = 0;
    let expense: number = 0;
    actionData.forEach(a => {
      let searchBy: Date = new Date(a.debitDate);
      if (searchBy.getMonth() + 1 == thisMonth && searchBy.getUTCFullYear() == thisYear) {
        a.actionType == 'INCOME' ? incomes += a.amount : expense += a.amount;
      }
    })
    this.columnChartByDebit = [
      ['הכנסות', incomes],
      ['הוצאות', expense]
    ]
  }

  initColumnChartByAction() {
    let thisMonth = new Date().getMonth() + 1;
    let thisYear = new Date().getFullYear();
    let actionData: Action[] = this.allActions.slice();
    let incomes: number = 0;
    let expense: number = 0;
    actionData.forEach(a => {
      let searchBy: Date = new Date(a.actionDate);
      if (searchBy.getMonth() + 1 == thisMonth && searchBy.getUTCFullYear() == thisYear) {
        a.actionType == 'INCOME' ? incomes += a.amount : expense += a.amount;
      }
    })
    this.columnChartByAction = [
      ['הכנסות', incomes],
      ['הוצאות', expense]
    ]
  }

  /**
   * הפונקציה תאתחל את כל הלקוחות שקיימים ואז תפעיל את הפונקציה שמתאחלת את המשתמש שמחובר.
   */
  initData() {
    if (this.myService.allCustomers == null) {
      this.myService.getAllCustomers().subscribe(
        (res) => {
          this.myService.allCustomers = res;
          this.initCustomer();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.initCustomer();
    }
  }

  /**
   * הפונקציה מאתחלת את פרטיו של המשתמש המחובר ואז מפעילה את הפונקציה שמאתחלת את כל הפעולות.
   */
  initCustomer() {
    if (this.myService.customer == null) {
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          this.myService.customer = res;
          this.initAllActions();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.initAllActions();
    }
  }

  /**
   * הפונקציה מאתחלת את כל הפעולות ואז מפעילה ואת הפונקציה שמאתחלת את הפעולות של הלקוח המחובר
   */
  initAllActions() {
    if (this.myService.allTheActionsInTheDB == null) {
      this.myService.getAllTheAction().subscribe(
        (res) => {
          this.myService.allTheActionsInTheDB = res;
          this.initActionsOfCustomer();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }else{
      this.initActionsOfCustomer();
    }
  }

  /**
   * הפונקציה מאתחלת את כל הפעולות שביצע הלקוח המחובר.
   */
  initActionsOfCustomer() {
    if (this.myService.allActions == null) {
      this.myService.getAllActionsOftheCustomer(this.myService.customer, this.myService.allTheActionsInTheDB).subscribe(
        (res) => {
          this.myService.allActions = res;
          this.allActions = this.myService.allActions;
          this.initRecentActions(this.myService.allActions);
          this.actionThisMonth = this.hasActionsByActionDateThisMonth();
          if (this.actionThisMonth == true) {
            this.initColumnChartByDebit();
            this.initColumnChartByAction();
          }
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allActions = this.myService.allActions;
      this.initRecentActions(this.myService.allActions);
      this.actionThisMonth = this.hasActionsByActionDateThisMonth();
      if (this.actionThisMonth == true) {
        this.initColumnChartByDebit();
        this.initColumnChartByAction();
      }
    }
  }

  hasActionsByActionDateThisMonth(): boolean {
    let today: Date = new Date();
    let ans: boolean = false;
    this.allActions.forEach(action => {
      let actionData: Date = new Date(action.actionDate);
      let debitDate: Date = new Date(action.debitDate);
      if (actionData.getFullYear() == today.getFullYear() && actionData.getMonth() + 1 == today.getMonth() + 1) {
        if (debitDate.getFullYear() == today.getFullYear() && debitDate.getMonth() + 1 == today.getMonth() + 1) {
          ans = true;
        }
      }
    })
    return ans;
  }

}
