import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createBalanceTable } from 'src/app/Share/Functions/Summary';
import { Action } from 'src/app/Share/Model/Action';
import { User } from 'src/app/Share/Model/User';
import { Category } from 'src/app/Share/Model/Category';
import { BalanceTable } from 'src/app/Share/Model/BalanceTable';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { showState } from 'src/app/Share/animation';
import { getMonthInHebrewByNumber } from 'src/app/Share/Functions/GetMonthByDate';
import { actionTypeFormEnglishToHebrew } from 'src/app/Share/Functions/EnglishToHebrew';
import { DisplayAvg } from 'src/app/Share/Functions/DispalyAvg';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-sum-month',
  templateUrl: './sum-month.component.html',
  styleUrls: ['./sum-month.component.css'],
  animations: [
    showState
  ]
})
export class SumMonthComponent implements OnInit {

  /** השנה העסקאות שלה מוצגת בסיכום */
  public year: number;
  /** החודש שהעסקאות שלו מוצגת בסיכום */
  public month: number;
  /** מגדיר האם הסיכום מתייחס לתאריך ביצוע או חיוב
   * שקר = ביצוע
   * אמת = חיוב
   */
  public byDebit: boolean;
  /** כל העסקאות שתועדו על שמו של הלקוח */
  public allActions: Action[];
  /** כל המשתמשים שייכים אל הלקוח */
  public allUsers: User[];
  /** כל הקטגוריות שקיימות בבסיס הנתונים */
  public allCategories: Category[];
  /** הסיכום על פי החודש והשנה */
  public summary: BalanceTable;
  /** מכיל את ההוצאות החודשיות בצורה נוחה ליצירת תרשים פאי */
  public expensePie: [][];
  /** מכיל את ההכנסות החודשיות בצורה נוחה ליצירת תרשים פאי */
  public incomePie: [][];
  /** פונקציה חיצונית הממירה מספר של חודש לשמו בעברית */
  public getMonthInHebrowByNumber: Function = getMonthInHebrewByNumber;
  /** פונקציה חיצונית המקבלת מספר עשרוני ומעגלת אותו אל שתי ספרות */
  public displayAvg: Function = DisplayAvg;

  /**
   * בנאי המחלקה מבצע הזרקה עצמאית של נתיב פעיל, שרת הלקוחות ונתב.
   * @param activedRouter - יאפשר לנו לקבל נתונים מהנתב.
   * @param myService - יאפשר לנו לבצע פונקציות משרת הלקוחות.
   * @param router - יאפשר לנו להעביר את הלקוח בין הקומפוננטות.
   */
  constructor(private activedRouter: ActivatedRoute, private myService: DemoCustomerServiceService, private router: Router) { 
    myService.initAllCustomers();
    myService.initAllActions();
  }

  /**
   * פונקציה שתופעל מייד לאחר יצירת הבנאי.
   * תאדג לאיתחול כל השדות.
   */
  ngOnInit() {
    this.initYearAndMonth();
    this.initData();
  }

  /**
   * הפונקציה פונה אל הנתב ומאתחלת ממנו את השנה, החודש, ואת אופן הצגת הנתונים.
   */
  initYearAndMonth() {
    this.activedRouter.params.subscribe(
      (res) => {
        this.year = res.year;
        this.month = res.month;
        if (res.by == 'debit') this.byDebit = true;
        if (res.by == 'action') this.byDebit = false;
      }
    )
  }

  /**
   * הפונקציה מתאחלת את טבלת הסיכומים ואת המערכי מידע שמאחסים את המידע של תרשימי הפאים.
   */
  private initTable() {
    this.summary = createBalanceTable(this.byDebit, this.year, this.month, this.allActions, this.allCategories, this.allUsers);
    this.incomePie = this.getIncomeCharts(this.summary);
    this.expensePie = this.getExpenseCharts(this.summary);
  }

  private initData() {
    if (this.myService.allCustomers == null) {
      this.myService.getAllCustomers().subscribe(
        (res) => {
          this.myService.allCustomers = res;
          this.initCustomer();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.initCustomer()
    }
  }

  /**
   * הפונקציה מאתחלת את כל הנתונים הדרושים ליצירת טבלה 
   */
  private initCustomer() {
    if (this.myService.customer == null) {
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          this.myService.customer = res;
          this.allUsers = this.myService.customer.users;
          this.initAllActions();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allUsers = this.myService.customer.users;
      this.initAllActions();
    }
  }

  private initAllActions() {
    if (this.myService.allTheActionsInTheDB == null) {
      this.myService.getAllTheAction().subscribe(
        (res) => {
          this.myService.allTheActionsInTheDB = res;
          this.initCustomersActions();
        },
        (err)=>{this.myService.HandlesErrors(err)}
      )
    }else{
      this.initCustomersActions();
    }
  }
  /**
   * מאתחל את כל הפעולות שביצע הלקוח.
   */
  private initCustomersActions() {
    if (this.myService.allActions == null) {
      this.myService.getAllActionsOftheCustomer(this.myService.customer, this.myService.allTheActionsInTheDB).subscribe(
        (res) => {
          this.myService.allActions = res;
          this.allActions = this.myService.allActions;
          this.initAllCategory();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allActions = this.myService.allActions;
      this.initAllCategory();
    }
  }

  /**
   * מאתחל את כל הקטגוריות מבסיס הנתונים.
   */
  private initAllCategory() {
    if (this.myService.allCategories == null) {
      this.myService.getCategories().subscribe(
        (res) => {
          this.myService.allCategories = res;
          this.allCategories = this.myService.allCategories;
          this.initTable();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allCategories = this.myService.allCategories;
      this.initTable();
    }
  }

  /**  שדה המכיל מערך של הנתונים המאפיינים את עיצוב התרשים פאי במסך קטן */
  public optionsPieSm = {
    is3D: true,
    backgroundColor: { fill: 'transparent' },
    chartArea: { left: '10%', top: '10%', width: '100%', height: '90%' },
    legend: { position: 'top', alignment: 'center', textStyle: { bold: 'true' } },
    pieSliceText: 'value-and-percentage',
    pieSliceTextStyle: {
      color: 'black',
      bold: 'true'
    },
    forceIFrame: 'true'
  }

  /**  שדה המכיל מערך של הנתונים המאפיינים את עיצוב התרשים פאי במסך גדול */
  public optionsPielg = {
    width: 720,
    height: 520,
    backgroundColor: { fill: 'transparent' },
    chartArea: { left: '38%', top: '10%', width: '100%' },
    legend: { position: 'top', alignment: 'center', textStyle: { bold: 'true' } },
    pieSliceText: 'value-and-percentage',
    pieSliceTextStyle: { color: 'black', bold: 'true' },
    forceIFrame: 'true'
  }


  /**
   * הפונקציה מחזירה מערך של מידע המאפשר ליצור תרשים פאי של ההוצאות
   * @param summary הסיכום על פיו יווצר הגרף.
   */
  getExpenseCharts(summary: BalanceTable): [][] {
    let data = [];
    summary.expenses.forEach(e => {
      data.push([e.category, e.amount]);
    })
    return data;
  }

  /**
  * הפונקציה מחזירה מערך של מידע המאפשר ליצור תרשים פאי של ההכנסות
  * @param summary הסיכום על פיו יווצר הגרף.
  */
  getIncomeCharts(summary: BalanceTable): [][] {
    let date = [];
    summary.incomes.forEach(i => {
      if (i.amount > 0) {
        date.push([i.category, i.amount]);
      }
    })
    return date;
  }

  /**
   * הפונקציה מעבירה את הלקוח את עמוד ניהול העסקאות בהתאם לשדות המחלקה ושם הקטגוריה שהתקבלה.
   * @param category שם הקטגוריה
   */
  public moveToActionByCategoryAndDate(category: string): void {
    let debitOrAction: string;
    this.byDebit ? debitOrAction = 'debit' : debitOrAction = 'action';
    this.router.navigate(["action/category/" + category + "/" + this.year + "/" + this.month + "/" + debitOrAction]);
  }

  /**
   * הפונקציה מעבירה את הלקוח את עמוד ניהול העסקאות בהתאם לשדות המחלקה ושם הקטגוריה שהתקבלה.
   * @param type סוג הפעולה
   */
  public moveToActionByTypeAndDate(type: String): void {
    let debitOrAction: string;
    this.byDebit ? debitOrAction = 'debit' : debitOrAction = 'action';
    this.router.navigate(["action/type/" + type + "/" + this.year + "/" + this.month + "/" + debitOrAction]);
  }

}

