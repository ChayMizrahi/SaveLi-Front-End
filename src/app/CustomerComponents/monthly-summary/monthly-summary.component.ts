import { Component, OnInit } from '@angular/core';
import { Action } from 'src/app/Share/Model/Action';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { MonthAndYear } from 'src/app/Share/Model/MonthAndYear';
import { getMonthsAndYears, createBalanceTable } from 'src/app/Share/Functions/Summary';
import { getMonthInHebrewByNumber, convertMonthNameInHebrewToNumber } from 'src/app/Share/Functions/GetMonthByDate';
import { actionTypeFormEnglishToHebrew } from 'src/app/Share/Functions/EnglishToHebrew';
import { BalanceTable } from 'src/app/Share/Model/BalanceTable';
import { showState } from 'src/app/Share/animation';
import { Category } from 'src/app/Share/Model/Category';
import { User } from 'src/app/Share/Model/User';
import { DisplayAvg } from 'src/app/Share/Functions/DispalyAvg';
import { Router } from '@angular/router';
import { tableSum } from './tableSum';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-monthly-summary',
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css'],
  animations: [
    showState
  ]
})
export class MonthlySummaryComponent implements OnInit {

  /** מכיל את כל העסקאות שהלקוח עיתד */
  public allActions: Action[];
  /** מכיל תקצירים חודשיים של העסקאות שביצע המשתמש על פי תאריך החיוב שלהם */
  public monthlyBriefByDebit: tableSum[] = [];
  /** מכיל תקצירים חודשיים של ההעסקאות שביצע המשתמש על פי תאריך הביצוע שלהם */
  public monthlyBriefByAction: tableSum[] = [];


  // Useful functions for the html page
  public getMonthInHebrowByNumber: Function = getMonthInHebrewByNumber;
  public actionTypeFormEnglishToHebrew: Function = actionTypeFormEnglishToHebrew;
  public displayAvg: Function = DisplayAvg;

  constructor(private myService: DemoCustomerServiceService, private router: Router) {
    myService.initAllCustomers();
    myService.initAllActions();
  }

  ngOnInit() {
    this.initData();
  }

  initData(){
    if(this.myService.allCustomers == null){
      this.myService.getAllCustomers().subscribe(
        (res)=>{
          this.myService.allCustomers = res;
          this.initCustomer()
        },
        (err)=>{
          this.myService.HandlesErrors(err)
        }
      )

    }else{
      this.initCustomer();
    }
  }

  initCustomer(){
    if(this.myService.customer == null){
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res)=>{
          this.myService.customer = res;
          this.initAlltheActionsDB();
        },
        (err)=>{this.myService.HandlesErrors(err)}
      )
    }else{
      this.initAlltheActionsDB();
    }
  }

  initAlltheActionsDB() {
    if (this.myService.allTheActionsInTheDB == null) {
      this.myService.getAllTheAction().subscribe(
        (res) => {
          this.myService.allTheActionsInTheDB = res;
          this.initAllActions();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.initAllActions();
    }
  }

  initAllActions() {
    if (this.myService.allActions == null) {
      this.myService.getAllActionsOftheCustomer(this.myService.customer, this.myService.allTheActionsInTheDB).subscribe(
        (res) => {
          this.myService.allActions = res;
          this.allActions = this.myService.allActions;
          this.initTablesSum();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allActions = this.myService.allActions;
      this.initTablesSum();
    }
  }

  /**
   * פונקציה שמאתחלת את התקצירים החודשיים על פי תאריכי ביצוע ותאריכי חיוב.
   */
  initTablesSum() {
    /** עובר על כל הפעולות שתועדו על ידי המשתמש. */
    this.allActions.forEach(action => {
      /** מעתד את הפעולה על פי תאריך החיוב שלה */
      this.addActioToMonthlyBrife(true, action);
      /** מתעד את הפעולה על פי תאריך הביצוע שלה */
      this.addActioToMonthlyBrife(false, action);
    })
    this.monthlyBriefByDebit.sort(
      (a, b) => {
        if (b.year != a.year) {
          return b.year - a.year;
        } else {
          return b.month - a.month;
        }
      }
    );
    this.monthlyBriefByAction.sort(
      (a, b) => {
        if (b.year != a.year) {
          return b.year - a.year;
        } else {
          return b.month - a.month;
        }
      }
    );

  }

  /**
   * הפונקציה תבחר באיזה רשימת תקצירים להתמקד, 
   * ובאיזה תאריך של הפעולה להתמקד על פי המשתנה בלויאני שהתקבל.
   * ותבדוק האם קיים תקציר חודשי התואם לחודש של הפעולה שהתקבלה ותזין את הנתונים  של הפעולה את אותו תקציר.
   * במידה ולא קיים תקציר היא תיצור אחד חדש.
   * @param byDebit האם הוספת הנתונים תהייה על פי תאריך ביוצע או תאריך חיוב.
   * @param action הפעולה שממנה ניקח את הנתונים.
   */
  private addActioToMonthlyBrife(byDebit: boolean, action: Action) {
    /** מכיל את הרשימה של התקצירים החודשיים אליהם יוכנסו הנתונים */
    let listMontlyBrief: tableSum[];
    /** שדה שנותן לנו אינדיקציה האם קיים ברשימה תקציר עם חודש ושנה
     * השווים אל החודש והשנה של התאריך פעולה */
    let exist: boolean = false;
    /** התאריך על פי נבצע את בדיקה (חיוב או ביצוע) */
    let sercheBy: Date;

    /** מתאחל את הרשימה אליה נזין את הנתונים ואת התאריך על פי נאחסן את הנתונים על פי הערך
     * התקבל כארגומנט
     */
    if (byDebit) {
      listMontlyBrief = this.monthlyBriefByDebit;
      sercheBy = new Date(action.debitDate);
    } else {
      listMontlyBrief = this.monthlyBriefByAction
      sercheBy = new Date(action.actionDate);
    }

    /** עובר בלולאה על המערך של כל התקצירים החודשיים על פי 
    * תאריך החיוב. ובודק האם כבר קיים תקציר חודשי 
    * עם החודש והשנה של תאריך החיוב של הפעולה שנמצאת בלולאה הראשונה.
    */
    for (let j = 0; (j < listMontlyBrief.length) && (exist == false); j++) {
      let month = listMontlyBrief[j];
      /** האם השנה והחודש של תאריך החיוב שווים אל השנה והחודש של התקציר החודשי */
      if ((month.year == sercheBy.getFullYear()) && (month.month == sercheBy.getMonth() + 1)) {
        /** כבר קיים תקציר חודשי:
         * מבצע בדיקה האם הפעולה היא הוצאה או הכנסה ומוסיף את הסכום שלה את הסה"כ הוצאות או סה"כ הכנסות בהתאמה.
         */
        if (action.actionType == "EXPENSE") month.totleExpenses += action.amount;
        if (action.actionType == 'INCOME') month.totleIncomes += action.amount;
        /** הופך את השדה לאמת כדי לעצור את הלולאה. */
        exist = true;
      }
    }

    /** בודק האם השדה קיים בחיובים */
    if (exist == false) {
      /** אם לא קיים, מייצר חדש ומוסיף אותו אל מערך התקצירים */
      let monthAndYear = new tableSum();
      monthAndYear.year = sercheBy.getFullYear();
      monthAndYear.month = sercheBy.getMonth() + 1;
      if (action.actionType == "EXPENSE") monthAndYear.totleExpenses += action.amount;
      if (action.actionType == 'INCOME') monthAndYear.totleIncomes += action.amount;
      listMontlyBrief.push(monthAndYear);

    }
  }


  /** הפונקציה מעבירה את הלקוח אל עמוד סיכום חודשי בהתאם לנתונים שהתקבלו כארגומנטים */
  public moveToSummaryMonth(year: number, month: number, by: string): void {
    this.router.navigate(["summary/" + year + "/" + month + "/" + by]);
  }




  getExpenseCharts(summary: BalanceTable): [][] {
    let data = [];
    summary.expenses.forEach(e => {
      data.push([e.category, e.amount]);
    })
    return data;
  }

  getIncomeCharts(summary: BalanceTable): [][] {
    let date = [];
    summary.incomes.forEach(i => {
      if (i.amount > 0) {
        date.push([i.category, i.amount]);
      }
    })
    return date;
  }

  public optionsPie = {
    width: 800,
    height: 400,
    is3D: true,
    backgroundColor: { fill: 'transparent' },
    chartArea: { left: '10%', top: '10%', width: '70%', height: '80%' },
    legend: {
      alignment: 'bottom',
      textStyle: {
        bold: 'true'
      }
    },
    pieSliceText: 'value-and-percentage',
    pieSliceTextStyle: {
      color: 'black',
      bold: 'true'
    },
    forceIFrame: 'true'
  }

}
