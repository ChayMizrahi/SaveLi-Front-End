import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { Action } from 'src/app/Share/Model/Action';
import { MonthAndYear } from 'src/app/Share/Model/MonthAndYear';
import { getMonthInHebrewByNumber, convertMonthNameInHebrewToNumber } from 'src/app/Share/Functions/GetMonthByDate';
import { LoginService } from 'src/app/Share/Services/login.service';
import { sortActionsByActionDate, sortActionsByDebitDate, sortActionsByAmount, sortActionsByTitle, sortActionsByCategory } from 'src/app/Share/Functions/ActionsSort';
import { actionTypeFormEnglishToHebrew } from 'src/app/Share/Functions/EnglishToHebrew';
import { User } from 'src/app/Share/Model/User';
import { MethodPayment } from 'src/app/Share/Model/MethodPayment';
import { Category } from 'src/app/Share/Model/Category';
import { setDebitDate } from 'src/app/Share/Functions/SetDebitDate';
import { showState } from 'src/app/Share/animation';
import { all } from 'q';
import { displayDateHebrow, displayDate } from 'src/app/Share/Functions/DisplayDate';
import { addZero } from 'src/app/Share/Functions/AddZero';
import { DisplayAvg } from 'src/app/Share/Functions/DispalyAvg';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-get-actions',
  templateUrl: './get-actions.component.html',
  styleUrls: ['./get-actions.component.css'],
  animations: [
    showState
  ]
})
export class GetActionsComponent implements OnInit {

  /** מציין איזה סוג אובייקט מקושר אל הפעולות שמוצגות.
   * קטגוריה / סוג פעולה / אמצעי תשלום / משתמש או כל הפעולות
   */
  public type: string;
  /** מציין האם להציג את ההוצאה על פי תאריך החיוב שלהם או תאריך הביצוע שלהם.
   * אמת = תאריך חיוב.
   * שקר = תאריך ביצוע.
   */
  public byDebit: boolean;
  /**
   * המזהה של אותו סוג אובייקט.
   *  קטגוריה - השם שלה
   *  משתמש / אמצעי תשלום - המזהה שלהם.
   *  סוג פעולה - 'EXPENSE' הוצאה , 'INCOME' הכנסה.
   *  אם נבחר להציג את כל הפעולות המזהה יהיה 1
   */
  public id: any;
  /** מציין את השנה בה חוייבו/בוצעו הפעולות */
  public year: number;
  /** מציין את החודש בו בוצעו/חוייבו הפעולות */
  public month: number;
  /** כל הפעולות שהלקוח תיעד */
  public allActions: Action[];
  /** כל הקטגוריות שקיימות בבסיס הנתונים */
  public allCategories: Category[];
  /** כל המשתמשים שברשותו של הלקוח */
  public allUsers: User[];
  /** כל אמצעי התשלום שברשותו של הלקוח */
  public allMethodPayment: MethodPayment[];
  /** מכיל את הפעולות שהלקוח יראה לאחר הסינון */
  public actionsToDisplay: Action[];
  /** מערך של כל החודשים והשנים בהם קיימות פעולות התואמות אל הנתונים שהתקבלו הנתיב */
  public activeMonthsAndYears: MonthAndYear[];
  /** מערך של כל הקטגוריות שסוגן הוא הוצאה */
  public categoriesOfExpense: Category[] = [];
  /** מערך של כל הקטגוריות שסוגן הוא הכנסה */
  public categoriesOfIncome: Category[] = [];
  /** האובייקט שנבחר להציג 
  * יכול להיות סוג של אמצעי תשלום, סוג של קטגוריה, משתמש או סוג פעולה.
  */
  public theEntity: any;
  /** מציין האם הלקוח בחר להוסיף פעולה חדשה */
  public addAction: boolean = false;
  /** הפעולה שתתוסף אל בסיס הנתונים בסיום יצירת פעולה חדשה */
  public actionToAdd: Action = new Action();
  /** ההודעה שתוצג למשתמש במידה ובעת הוספת פעולה חדשה תאריך הביצוע שהוא הזין לא תקין.
   * כברירת מחדל הוא מחרוזת ריקה.
   */
  public megActionDate: string = '';
  /** ההודעה שתוצג למשתמש במידה ובעת הוספת פעולה חדשה סכום הפעולה הוא שלילי. */
  public megAmountNegetive: string = '';
  /** ההודעה שתוצד למשתמש במידה ובעת הוספת פעולה חדשה הסכום לא הוזן כלל */
  public megAmountNull: string = '';
  /** פונקציה חיצונית שמציגה את התאריכים באופן קרא ונוח */
  public displayDateHebrow: Function = displayDateHebrow;
  /** אובייקט מסוג פעולה שמאוחל ברגע שהמשתמש בוחר לעדכן פעולה בפעולה שנבחרה */
  public actionToUpdate: Action;
  /** מסמן את מיקום הפעולה שנבחרה לעדכון במערל הפעולה שמוצכגת ללקוח */
  public makeUpdate: number = -1;
  //public displayDate: Function = displayDate; 
  public getMonthInHebrowByNumber: Function = getMonthInHebrewByNumber;
  public displayAvg: Function = DisplayAvg;
  public sumExpense: number;
  public sumIncome: number;



  /**
   * יוצר את המחלקה ומבצע הזרקה עצמאית של נתיב פעיל, שרת הלקוחות והנתב.
   * @param activedRouter מאפשר לקבל נתונים על הנתיב.
   * @param myService מאפשר לבצע פעולות הקשורות לשרת.
   * @param router מאפשר להעביר את המשתמש בין קומפוננטות.
   */
  constructor(private activedRouter: ActivatedRoute, private myService: DemoCustomerServiceService, private router: Router) {
    myService.initAllCustomers();
    myService.initAllActions();
  }

  /** מאתחל את כל השדות */
  ngOnInit() {
    this.initDateFormTheRouter();
    this.initDataFormService();
  }

  /** מאתחל את כל השדות שנלקחים מהנתיב. */
  initDateFormTheRouter() {
    this.activedRouter.params.subscribe(
      (data) => {
        this.type = data.type;
        this.id = data.id;
        this.month = Number(data.month);
        this.year = Number(data.year);
        if (data.by == 'action') this.byDebit = false;
        if (data.by == 'debit') this.byDebit = true;
      }
    )
  }

  /**
   * הפונקציה מאתחלת את כל השדות שנדרשת פניה לשרת כדי לקבל אותם.
   * היא תתחיל אם איתחול האובייקט לקוח וברגע שתסיים תפעיל את הפונקציה שמפעילה את איתחול הקטגוריות.
   */
  initDataFormService() {
    if(this.myService.allCustomers == null){
      this.myService.getAllCustomers().subscribe(
        (res)=>{
          this.myService.allCustomers = res;
          this.initCustomer();
        },
        (err)=>{this.myService.HandlesErrors(err)}
      )
    }else{
      this.initCustomer();
    }
  }

  initCustomer(){
    if (this.myService.customer == null) {
      // אם הלקוח לא קיים פונה לשרת כדי לקבל אותו.
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          this.myService.customer = res;
          this.allMethodPayment = this.myService.customer.methodPayments;
          this.allUsers = this.myService.customer.users;
          this.initCategories();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allMethodPayment = this.myService.customer.methodPayments;
      this.allUsers = this.myService.customer.users;
      this.initCategories();
    }
  }

  initAllActionsFormDB(){
    if(this.myService.allTheActionsInTheDB == null){
      this.myService.getAllTheAction().subscribe(
        (res)=>{
          this.myService.allTheActionsInTheDB = res;
          this.initAllActionsOfCustomer();
        },
        (err)=>{this.myService.HandlesErrors(err)}
      )
    }else{
      this.initAllActionsOfCustomer();
    }
  }

  /**
   * הפונקציה מאתחל את כל הקטגוריות ומפעילה פונקציה שדואגת לאתחול כל פעולות.
   */
  initCategories() {
    if (this.myService.allCategories == null) {
      this.myService.getCategories().subscribe(
        (res) => {
          this.myService.allCategories = res;
          this.allCategories = this.myService.allCategories;
          this.initCategoryByType();
          this.initAllActionsFormDB()
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allCategories = this.myService.allCategories;
      this.initCategoryByType();
      this.initAllActionsFormDB()
    }
  }

  /** הפונקציה מתאחלת את כל הפעולות */
  initAllActionsOfCustomer() {
    if (this.myService.allActions == null) {
      this.myService.getAllActionsOftheCustomer(this.myService.customer, this.myService.allTheActionsInTheDB).subscribe(
        (res) => {
          this.myService.allActions = res;
          this.allActions = this.myService.allActions;
          this.initActionsToDisplay();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allActions = this.myService.allActions;
      this.initActionsToDisplay();
    }
  }

  /**
   * ממיין את כל פעולות של הלקוח על פי סוג והמזהה שהתקבל מהנתיב.
   * במידה והסוג שהתקבל מהנתיב לא תקין הפונקציה תחזיר את כל הפעולות.
   */
  sortActionsByType(): Action[] {
    let actionsByType: Action[] = [];
    this.allActions.forEach(action => {
      if (this.type == 'category') {
        if (action.category.name == this.id) {
          actionsByType.push(action);
        }
      } else if (this.type == 'type') {
        if (action.actionType == this.id) {
          actionsByType.push(action);
        }
      } else if (this.type == 'methodPayment') {
        if (action.methodPayment.id == this.id) {
          actionsByType.push(action);
        }
      } else if (this.type == 'user') {
        if (action.user.id == this.id) {
          actionsByType.push(action);
        }
      } else if (this.type == 'all') {
        actionsByType.push(action);
        /** אם אין התאמה לשום סוג מעביר לעמוד שגיאות */
      } else {
        this.router.navigate(['404']);
      }
    })
    return actionsByType;
  }

  /**
   * הפונקציה לוקחת את כל הנתונים שהתקבלו מהנתיב ומאתחלת רשימה של פעולות כדי להציג ללקוח.
   * בנוסף, הפונקציה מאתחלת מערך של כל החודשים והשנים בהם קיימות פעולות התואמות לנתונים מהנתיב.
   */
  initActionsToDisplay() {
    // ממיין את כל הפעולות לפי הסוג והמזהה
    let actionsByType = this.sortActionsByType();
    // ממיין את כל הפעולות הממויינות על פי החודש השנה וסוג החיוב.
    this.actionsToDisplay = this.sortActionByDateAndDebit(actionsByType);
    // מאתחל את הרשימה של כל החודשים והשנים בהם קיימות הוצאות על פי הרשימה שמיינה את כל הפעולות רק על פי מזהה וסוג.
    this.activeMonthsAndYears = this.initYearAndMonthWithActions(actionsByType);
    this.initEntity();
  }

  /**
   * הפונקציה מאתחלת את השדה "היישות " בישות הספציפית שנבחרה להיות מוצגת.
   */
  initEntity() {
    // במידה הפעולות שנבחרו להציג שייכות לסוג קטגוריה מאתחל
    // את האובייקט ישות בקטגוריה הספציפית שנבחרה.
    if (this.type == "category") {
      this.allCategories.forEach(c => {
        if (c.name == this.id) {
          this.theEntity = c;
        }
      })
    }
    // במידה והפעולות שנבחרו להציג שייכות למשתמש כל שהוא 
    // מתאחל את האובייקט הישות במשתמש הספציפי שהפעולות שלו נבחרו להציג.
    if (this.type == "user") {
      this.allUsers.forEach(user => {
        if (user.id == this.id) {
          this.theEntity = user;
        }
      })
    }
    // במידה והפעולות שמוצגת שייכות לאמצעי תשלום , מתאחל את הישות  באמצעי תשלום הספציפי
    if (this.type == "methodPayment") {
      this.allMethodPayment.forEach(mp => {
        if (mp.id == this.id) {
          this.theEntity = mp;
        }
      })
    }
  }

  /**
   * הפונקציה מקבלת מערך של פעולות וממיינת אותם בהתאם לחודש השנה וסוג החיוב שהתקבלו מהנתיב.
   * @param actions 
   */
  sortActionByDateAndDebit(actions: Action[]): Action[] {
    if (actions.length > 0) {
      let sortedActions: Action[] = [];
      this.sumExpense = 0;
      this.sumIncome = 0;
      this.initYearAndMonthIfTheyEmpty(actions);
      actions.forEach(action => {
        let searchBy: Date;
        this.byDebit ? searchBy = new Date(action.debitDate) : searchBy = new Date(action.actionDate);
        if (searchBy.getFullYear() == this.year && searchBy.getMonth() + 1 == this.month) {
          sortedActions.push(action);
          if (action.actionType == "EXPENSE") this.sumExpense += action.amount;
          if (action.actionType == "INCOME") this.sumIncome += action.amount;
        }
      })
      return sortedActions;
    } else {
      return [];
    }
  }

  /** 
  * הפונקציה מאתחלת את השנה והחודש של המחלקה בשנה ובתאריך של האובייקט האחרון במערך הפעולות שהתקבל. 
  */
  initYearAndMonthIfTheyEmpty(actions: Action[]) {
    let theLastAction: Action = actions[actions.length - 1];
    let theDate: Date;
    this.byDebit == true ? theDate = new Date(theLastAction.debitDate) : theDate = new Date(theLastAction.actionDate);
    if (this.year == 0) {
      this.year = theDate.getFullYear();
    }
    if (this.month == 0) {
      this.month = theDate.getMonth() + 1;
    }
  }

  /**
   * הפונקציה מחזירה מערך של כל המשתמשים הפעילים שברשותו של הלקוח.
   */
  getActiveUsers(): User[] {
    let activeUsers: User[] = [];
    this.allUsers.forEach(user => {
      if (user.active == true) {
        activeUsers.push(user);
      }
    })
    return activeUsers;
  }

  /** הפונקציה ממיינת את כל הקטגוריות לשני קבוצות:
   *  כל הקטגוריות שסוג הכנסה וכל הקטגוריות שסוגם הוצאה.
   *  בנוסף, הקטגוריות חייבות להיות פעילות
   */
  public initCategoryByType() {
    this.myService.allCategories.forEach(category => {
      if (category.type == 'EXPENSE' && category.active) {
        this.categoriesOfExpense.push(category);
      }
      if (category.type == 'INCOME' && category.active) {
        this.categoriesOfIncome.push(category);
      }
    })
  }

  /** הפונקציה מחזירה את כל אמצעי התשלום הפעילים של הלקוח */
  public getActiveMethodPayment(): MethodPayment[] {
    let activeMethodPayments: MethodPayment[] = [];
    this.allMethodPayment.forEach(mp => {
      if (mp.active == true) {
        activeMethodPayments.push(mp);
      }
    })
    return activeMethodPayments;
  }

  /**
   * הפונקציה מקבלת מערך של פעולות ומחזירה מערך ממויין של כל החודש והשנה שהיה בהם פעולות.
   * @param actions הפעולות על פי הם יתבצע הבדיקה.
   */
  initYearAndMonthWithActions(actions: Action[]): MonthAndYear[] {
    // כל התאריכים בהם רשם המשתמש פעולות
    let yearsAndMonths: MonthAndYear[] = [];
    // עובר על כל הפעולות
    for (let i = 0; i < actions.length; i++) {
      // מגדיר בהתחלה שלא קיים תיעוד לחודש והשנה של הפעולה.
      let exists: boolean = false;
      // מגדיר את התאריך על פיו יתבצע החיפוש
      let searchBy: Date;
      // אם הוגדר כי החיפוש יתבצע על פי תאריך חיוב אז החיפוש יתבצע על פי תאריך החיוב, אחרת על ידי תאריך ביצוע.
      this.byDebit ? searchBy = new Date(actions[i].debitDate) : searchBy = new Date(actions[i].actionDate);
      // מתחיל לעבור על כל החודשים והשנים שנקבע כי נרשמו על שמים פעולות.
      // ממשיך לעבור על כולם כל עוד הוא עדין לא עבר על כולם וגם עדין מצוין כי התאריך של הפעולה לא קיים.
      for (let j = 0; (j < yearsAndMonths.length) && (exists == false); j++) {
        let monthAndYear = yearsAndMonths[j];
        // בדיקה האם החודש והשנה של הפעולה כבר מתועדים במערך החודשים והשנים.
        if ((monthAndYear.year == searchBy.getFullYear()) && (monthAndYear.month == searchBy.getMonth() + 1)) {
          exists = true;
        }
      }
      // אם לא קיים, מייצר חדש.
      if (exists == false) {
        let monthAndYear = new MonthAndYear();
        monthAndYear.year = searchBy.getFullYear();
        monthAndYear.month = searchBy.getMonth() + 1;
        yearsAndMonths.push(monthAndYear);
      }
    }
    // מחזיר רשימה ממויינת מהתאריך ההמוקדם ביותר למאוחר ביותר.
    return yearsAndMonths.sort((a, b) => {
      if (b.year != a.year) {
        return b.year - a.year;
      } else {
        return b.month - a.month;
      }
    });
  }

  /** הפונקציה מחזירה את השם של האובייקט שנבחר להציג את הפעולות שלו  */
  getEntityName(): string {
    let name: string;
    if (this.type == 'category') {
      name = this.id;
    } else if (this.type == 'type') {
      if (this.id == 'EXPENSE') name = "הוצאה";
      if (this.id == 'INCOME') name = "הכנסה"
    } else if (this.type == 'methodPayment') {
      this.allMethodPayment.forEach(mp => {
        if (mp.id == this.id) {
          name = mp.name;
        }
      });
    } else if (this.type == 'user') {
      this.allUsers.forEach(u => {
        if (u.id == this.id) {
          name = u.name;
        }
      });
    } else {
      name = "כל הפעולות"
    }
    return name;
  }

  /**
   * הפונקציה מוחקת מבסיס הנתונים את הפעולה שהמזהה שלה התקבל כארגומנט ומוחקת את הפעולה מהמערך כל הפעולות שנמצא בשרת הלקוחות.
   * לאחר המחיקה מבסיס הנתונים והמערך תופעל הפונקציה שמתאתחלת מחדש את הפעולות שמוצגת.
   * @param actionId - המזהה של הפעולה שתוסר.
   */
  public removeAction(actionId: number) {

    let ans: boolean = confirm("האם ברצונך למחוק את הפעולה?");
    if (ans) {
      this.myService.removeAction(actionId).subscribe(
        (res) => {
          alert("הפעולה נמחקה בהצלחה");
          // עובר על כל הפעולות ממערך כל הפעולות כדי למצאו את המיקום של הפעולה שהמזהה שלה התקבל ואז למחוק אותה מהמערך.
          for (let i: number = 0; i < this.myService.allActions.length; i++) {
            if (this.myService.allActions[i].id == actionId) {
              this.myService.allActions.splice(i, 1);
            }
          }
          // מאתחל מחדש את הפעולות שיוצגו ללקוח. 
          this.initActionsToDisplay();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  /**
   * הפונקציה מופעלת כאשר הלקוח בוחר להוסיף פעולה חדשה.
   * היא הופכת את הוסף פעולה לחיובי ומאתחלת את פעולה להוספה בנתונים.
   * @param type קובע מה יהיה סוג הפעולה - הוצאה או הכנסה.
   */
  addActionByType(type: string) {
    // מאפשר ללקוח להוסיף פעולה חדשה
    this.addAction = true;
    this.actionToAdd = new Action();
    // מאתחל את כותרת הפעולה לכותרת ריקה
    this.actionToAdd.title = '';
    // מאתחל את תאריך הביצוע של הפעולה החדשה ליום הראשון בחודש והבשנה שנבחרו.
    this.actionToAdd.actionDate = this.year + "-" + addZero(this.month) + "-01";
    // מאתחל את הסוג של הפעולה לסוג שהתקבל כארגומנט
    this.actionToAdd.actionType = type;
    // מאתחל את אמצעי התשלום דרכו בוצעה הפעולה לאמצעי תשלום הראשון במערך של אמצעי התשלום הפעילים
    this.actionToAdd.methodPayment = new MethodPayment();
    this.actionToAdd.methodPayment.id = this.getActiveMethodPayment()[0].id;
    // מאתחל את המשתמש דרכו בוצעה הפעולה למתשמש הראשון במערך המשתמשים הפעילים
    this.actionToAdd.user = new User();
    this.actionToAdd.user.id = this.getActiveUsers()[0].id;
    // מאתחל את הקטגוריה של הפעולה לקטגוריה הראשונה במערל בהתאם לסוג הפעולה
    this.actionToAdd.category = new Category();
    if (this.actionToAdd.actionType == 'EXPENSE') this.actionToAdd.category.id = this.categoriesOfExpense[0].id;
    if (this.actionToAdd.actionType == 'INCOME') this.actionToAdd.category.id = this.categoriesOfIncome[0].id;
    // אם הסוג פעולות שמוצג הוא חלק מקטגוריה אז מאתחל לקטגוריה נבחרה.
    if (this.type == 'category') this.actionToAdd.category = this.theEntity;
    if (this.type == 'type') this.actionToAdd.actionType = this.id;
    if (this.type == 'methodPayment') this.actionToAdd.methodPayment = this.theEntity;
    if (this.type == 'user') this.actionToAdd.user = this.theEntity;
  }

  /**
   * הפונקציה המופעלת בעת סיים תיעוד עסקה חדשה.
   * בודקת שהעסקה החדשה תקינה ומגדירה אצלה תאריך חיוב.
   */
  finishAdd() {
    
    // מתאחלת את ההודעות שגיאה לריקות.
    this.megActionDate = '';
    this.megAmountNegetive = '';
    this.megAmountNull = '';
    // מגדירה את זה שביינתים העסקה תקינה
    let valid: boolean = true;
    // בדיקה שהשדה תאריך ביצוע לא ריק
    if (this.actionToAdd.actionDate == '') {
      this.megActionDate = 'שדה זה חובה';
      valid = false;
    }
    // בדיקה שהשדה סכות לא ריק.
    //this.actionToAdd.amount = Number(this.actionToAdd.amount);
    console.log(this.actionToAdd.amount)
    if (this.actionToAdd.amount == undefined) {
      this.megAmountNull = 'שדה זה חובה';
      valid = false;
    } else {
      // בדיקה שהשדה סכום חיובי
      if (0 >= this.actionToAdd.amount || this.actionToAdd.amount > 999999) {
        this.megAmountNegetive = "סכום הפעולה חייב להיות גדול מאפס וקטן ממיליון"
        valid = false;
      }

    }
    // אם השדה תקין עדין אמת 
    if (valid) {
      this.setMpCategoryAndUser(this.actionToAdd);
      // מאתחל את השדה תאריך חיוב
      setDebitDate(this.actionToAdd);
      // מוסיף את ההוצאה
      this.myService.addAction(this.actionToAdd).subscribe(
        (res) => {
          this.myService.allActions.push(res);
          this.allActions = this.myService.allActions;
          this.initActionsToDisplay();
          this.addAction = false;
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  /**
   * הפונקציה מתחילה את עדכון הפעולה.
   * היא מקבלת את מיקום הפעולה שהלקוח בחר לעדכן ומאתחלת את השדה פעולה לעדכון 
   * בפרטי הפעולה שנבחרה לעדכן.
   * @param i מיקום הםעולה במערך הפעולות שמוצגת
   */
  startUpdate(i: number) {
    this.makeUpdate = i;
    // הסיבה שאנו מעתיקים את כל שדה ושדה בנפרד ולא עושים פשוט 
    // this.actionToUpdate = this.actionsToDisplay[i]
    // היא בגלל שאם נעשה ככה ניצור aliasng 
    // ואז כל שינוי שנעשה על השדה פעולה לעדכון יכול מייד גם על הפעולה במערך. 
    this.actionToUpdate = new Action();
    this.actionToUpdate.actionDate = displayDate(new Date(this.actionsToDisplay[i].actionDate));
    this.actionToUpdate.actionType = this.actionsToDisplay[i].actionType;
    this.actionToUpdate.amount = this.actionsToDisplay[i].amount;
    this.actionToUpdate.id = this.actionsToDisplay[i].id;
    this.actionToUpdate.title = this.actionsToDisplay[i].title;
    this.actionToUpdate.debitDate = this.actionsToDisplay[i].debitDate;
    this.actionToUpdate.methodPayment = new MethodPayment();
    this.actionToUpdate.methodPayment.id = this.actionsToDisplay[i].methodPayment.id;
    this.actionToUpdate.user = new User();
    this.actionToUpdate.user.id = this.actionsToDisplay[i].user.id;
    this.actionToUpdate.category = new Category();
    this.actionToUpdate.category.id = this.actionsToDisplay[i].category.id;
  }

  /**
   * הפונקציה מבצעת בדיקה שהאובייקט המעודכן תקין ואז מעדכנת אותו בבסיס הנתונים.
   */
  finishUpdate() {
    // מתאחלת את ההודעות שגיאה לריקות.
    this.megActionDate = '';
    this.megAmountNegetive = '';
    this.megAmountNull = '';
    // מגדירה את זה שביינתים העסקה תקינה
    let valid: boolean = true;
    // בדיקה שהשדה תאריך ביצוע לא ריק
    if (this.actionToUpdate.actionDate == '') {
      this.megActionDate = 'שדה זה חובה';
      valid = false;
    }
    // בדיקה שהשדה סכות לא ריק.
    if (this.actionToUpdate.amount == undefined) {
      this.megAmountNull = 'שדה זה חובה';
      valid = false;
    } else {
      // בדיקה שהשדה סכום חיובי
      if (0 >= this.actionToUpdate.amount) {
        this.megAmountNegetive = 'חובה להזין ערך חיובי'
        valid = false;
      }
    }
    // אם השדה תקין עדין אמת 
    if (valid) {
      this.actionToUpdate.amount = Number(this.actionToUpdate.amount);
      this.setMpCategoryAndUser(this.actionToUpdate);
      setDebitDate(this.actionToUpdate);
      this.myService.updateAction(this.actionToUpdate).subscribe(
        (res) => {
          for (let i: number = 0; i < this.myService.allActions.length; i++) {
            if (this.myService.allActions[i].id == res.id) {
              this.myService.allActions[i] = res;
            }
          }
          this.allActions = this.myService.allActions;
          this.initActionsToDisplay();
          alert("הפעולה עודכנה בהצלחה");
          this.cancelUpdate();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  /**
   * הפונקציה מקבלת פעולה שהשדות קטגוריה, משתמש ואמצעי תשלום אצלה מכילים רק מזהה ומאתחלת את אותם שדות.
   * @param action פעולה חייבת להכיר את המזהה של משתמש, אמצעי התשלום והקטגוריה.
   */
  private setMpCategoryAndUser(action: Action) {
    this.allCategories.forEach(c => {
      if (c.id == action.category.id) {
        action.category = c;
      }
    })
    this.allUsers.forEach(u => {
      if (u.id == action.user.id) {
        action.user = u;
      }
    })
    this.allMethodPayment.forEach(mp => {
      if (mp.id == action.methodPayment.id) {
        action.methodPayment = mp;
      }
    })
  }

  /** הפונקציה מבטל את פעלות העדכון */
  cancelUpdate() {
    this.makeUpdate = -1;
    this.actionToUpdate = null;
  }

  /**
   * הפונקציה תופעל כשמשתמש יבחר להציג פעולה ע"פ חיוב או על פי ביצוע.
   * היא תהפוך את השדה על ידי חיוב לערכו המקביל אליו,
   * תאסוף מחדש את כל החודשים בהם היו פעולות
   * ותאחל מחדש את הרשימה של הפעולות שמוצגת ללקוח.
   */
  changeTheDisplayOfTheActions() {
    this.byDebit = !this.byDebit;
    this.initActionsToDisplay();
  }

  /**
   * הפונקציה תופעל כשהשתמש יבחר להציג פעולות מחודש והשנה אחרים.
   * היא תשנה את הערכים המחלקתיים של שנה וחודש ולערכים שהתקבלו ותאחל מחדש את מערך הפעולות
   * שמוצגת ללקוח.
   * @param monthAndYear - פורמט של שנה ותאריך כמו זה שמוצג ללקוח.
   * לדוגמה: "ינואר 2019" 
   */
  changeYearMonth(monthAndYear: string) {
    var res = monthAndYear.split(" ");
    this.month = convertMonthNameInHebrewToNumber(res[0]);
    this.year = Number(res[1]);
    this.initActionsToDisplay();
  }

  /**
   * הפונקציה מחזירה אמת במידה והאובייקט הנבחר מוגדר כלא פעיל.
   * שימושי בסיטואציה האם להציג כפתורי הוספה או לא.
   */
  ifTheEntityUnactive(): boolean {
    if (this.type == 'type') {
      return false;
    } else {
      if (this.theEntity.active == false) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * הפונקציה מחזירה אמת במידה וקיים לפחות אמצעי תשלום אחד פעיל ולפחות משתמש אחד פעיל
   */
  posibaleToAddAction() {
    if (this.getActiveMethodPayment().length > 0 && this.getActiveUsers().length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**  הפונקציה ממיינת את הפעולות שהמשתמש רואה בסדר שונה מזה המוצג לא בהתחלה */
  sortAction(by: string) {
    switch (by) {
      case 'actionDate':
        sortActionsByActionDate(this.actionsToDisplay);
        break;
      case 'debitDate':
        sortActionsByDebitDate(this.actionsToDisplay);
        break;
      case 'amount':
        sortActionsByAmount(this.actionsToDisplay);
        break;
      case 'title':
        sortActionsByTitle(this.actionsToDisplay);
        break;
      case 'category':
        sortActionsByCategory(this.actionsToDisplay);
        break;
      case 'actionDate':
        sortActionsByActionDate(this.actionsToDisplay);
        break;
      default:
        break;
    }
  }

}
