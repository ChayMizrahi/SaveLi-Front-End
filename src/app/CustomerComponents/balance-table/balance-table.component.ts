import { Component, OnInit, Input } from '@angular/core';
import { getCurrentlyMonthInHebrew } from 'src/app/Share/Functions/GetMonthInHebrow';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { BalanceTable } from 'src/app/Share/Model/BalanceTable';
import { displayDate } from 'src/app/Share/Functions/DisplayDate';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { User } from 'src/app/Share/Model/User';
import { MonthAndYear } from 'src/app/Share/Model/MonthAndYear';
import { getMonthInHebrewByNumber } from 'src/app/Share/Functions/GetMonthByDate';
import { DisplayAvg } from 'src/app/Share/Functions/DispalyAvg';
import { Row } from 'src/app/Share/Model/Row';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-balance-table',
  templateUrl: './balance-table.component.html',
  styleUrls: ['./balance-table.component.css']
})
export class BalanceTableComponent implements OnInit {

  public monthAndYearWithTable: MonthAndYear[];

  public month: number;
  public year: number;
  public table: BalanceTable;

  public dataExpense;
  public dataIncome;
  public avgData;

  public dataExpenseExists: boolean = false;
  public dataIncomeExists: boolean = false;

  public getMonthByNumber: Function = getMonthInHebrewByNumber;
  public displayAvg: Function = DisplayAvg;

  constructor(private myService: CustomerService, private router: Router, private activeRouter: ActivatedRoute) {
   

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.table = undefined;
        this.getMonthByRouter();
        this.getYearByRouter();
        this.changTable(this.year, this.month);
      }
    });

  }

  ngOnInit() {
    this.getMonthByRouter();
    this.getYearByRouter();
 //  this.getTableAndInitalizeData(this.year, this.month);
 //   this.getTable(this.year, this.month);
 //   this.initializesActiveDate();
  }

  public changTable(year: number, month: number) {
   // this.getTable(year, month);
  }
/*
  public getTable(year: number, month: number) {
    this.getTableAndInitalizeData(year, month);
    this.month = month;
    this.year = year
  }
*/
  getYearByRouter() {
    this.activeRouter.params.subscribe(
      (res) => {
        this.year = res.year;
      }
    )
  }

  getMonthByRouter() {
    this.activeRouter.params.subscribe(
      (res) => {
        this.month = res.month;
      }
    )
  }

  public moveToActionByCategoryAndDate(category: string): void {
    this.router.navigate(["action/category/" + category + "/" + this.year + "/" + this.month]);
  }

  public moveToActionByTypeAndDate(type: String): void {
    this.router.navigate(["action/type/" + type + "/" + this.year + "/" + this.month]);
  }
/*
  public getTableAndInitalizeData(year: number, month: number) {
    this.myService.getBalanceTableByDate(year, month).subscribe(
      (res) => {
        this.table = res;
        this. initPieCharstAndAvgCharts(res.expenses, res.incomes);
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }
/*
  public initializesActiveDate() {
    this.myService.getActiveMonthYear().subscribe(
      (res) => { this.monthAndYearWithTable = res },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }
*/
  public initPieCharstAndAvgCharts(expense: Row[], incomes: Row[]) {
    this.dataExpense = [];
    this.dataIncome = [];

    if (expense.length != 0) {
      this.dataExpenseExists = true;
      expense.forEach(a => {
        this.dataExpense.push([a.category, a.amount])
      })
    } else {
      this.dataExpenseExists = false;
      this.dataExpense = [];
    }

    if (incomes.length != 0) {
      this.dataIncomeExists = true;
      incomes.forEach(a => {
        this.dataIncome.push([a.category, a.amount])
      })
    } else {
      this.dataIncomeExists = false;
    }

    this.avgData = [];
    expense.forEach(e => {
      if (e.avg > 0) {
        this.avgData.push([e.category, e.amount, e.avg]);
      }
    })
  }

  public optionsExpense = {
    width: 450,
    height: 200,
    title: 'התפלגות ההוצאות החודשית שלך',
    is3D: true,
    backgroundColor: { fill: 'transparent' },
    chartArea: { left: '10%', top: '10%', width: '70%', height: '80%' },
    legend: {
      alignment: 'center',
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

  public optionsIncome = {
    width: 450,
    height: 200,
    title: 'התפלגות ההכנסות החודשית שלך',
    is3D: true,
    backgroundColor: { fill: 'transparent' },
    chartArea: { left: '10%', top: '10%', width: '70%', height: '80%' },
    legend: {
      alignment: 'center',
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

  public optionsAvg = {
    width: 450,
    height: 200,
    forceIFrame: 'true',
    backgroundColor: { fill: 'transparent' },
    title: 'השוואת ההוצאות שלך לעומת חודשים קודמים',
  };


}
