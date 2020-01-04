import { Component, OnInit } from '@angular/core';

import { Category } from 'src/app/Share/Model/Category';
import { MethodPayment } from 'src/app/Share/Model/MethodPayment';
import { User } from 'src/app/Share/Model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/Share/Services/login.service';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { setDebitDate } from 'src/app/Share/Functions/SetDebitDate';
import { Action } from 'src/app/Share/Model/Action';
import { Customer } from 'src/app/Share/Model/Customer';
import { Observable } from 'rxjs';
import { showState } from 'src/app/Share/animation';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { DisplayAvg } from 'src/app/Share/Functions/DispalyAvg';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
  animations: [
    showState
  ]
})
export class AddExpenseComponent implements OnInit {

  /** הפעולה שתכיל בתוכה את הערכים של הפעולה החדשה */
  public action: Action = new Action();
  /** מערך של כל הקטגרויות הפעילות המוגדרות כהוצאה */
  public categories: Category[];
  /** מערך של כל אמצעי התשלום הפעילים ברשותו של הלקוח */
  public activeMethodPayments: MethodPayment[];
  /** מערך של כל המשתמשים הפעילים ברשותו של הלקוח */
  public activeUsers: User[];
  /** סכום כל ההוצאות שתאריך הביצוע שלהם הוא החודש הנוכחי */
  public totleExpense: number;
  /** סכום כל הפעולות שתאריך החיוב ותאריך הביצוע שלהם הוא בחודשי הנוכחי */
  public expenseThisMonth: number;
  /** סכום כל הפעולות שתאריך החיוב שלהם הוא בחודש הבא, אך תאריך הביצוע הוא בחודש הנוכחי */
  public expenseNextMonth: number;
  public DisplayAvg:Function = DisplayAvg;

  /**
   * הבנאי של המחלקה, אחראי על איתחול הפעולה ולבצע הזרקה עצמאית של שרת הלקוחות והנתב.
   * @param myService יאפשר לנו לגשת אל הפונקציות והשדות שנמצאים בתוך השרת 
   * @param router יאפשר לנו להעביר את המשתמש בין קומפוננטות
   */
  constructor(public myService: DemoCustomerServiceService, private router: Router) {
    myService.initAllCustomers();
    myService.initAllActions();
    this.action.actionType = "EXPENSE"
    this.action.methodPayment = new MethodPayment();
    this.action.user = new User();
    this.action.category = new Category();
  }

  /**
   * פונקציה המופעלת מייד לאחר יצירת בנאי המחלקה.
   * אחראית לאתחל את שדות המחלקה.
   */
  ngOnInit() {
    this.initData();
  }

  /** 
   * הפונקציה מאתחלת את כל הנתונים הדרושים להצגת הדף
   */
  initData() {
    if (this.myService.allCustomers == null) {
      this.myService.getAllCustomers().subscribe(
        (res) => {
          // מאתחל את רשימת כל הלקוחות 
          this.myService.allCustomers = res;
          // מאתחל את רשימת השתמשים הפעילים
          this.initActiveUser();
          // מאתחל את רשימת אמצעי התשלום הפעילים
          this.initActiveMethodPayment();
          // מאתחל את הקטגוריות על פי סוג העמוד
          this.initCategoryByType(this.action.actionType);
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      // מאתחל את רשימת השתמשים הפעילים
      this.initActiveUser();
      // מאתחל את רשימת אמצעי התשלום הפעילים
      this.initActiveMethodPayment();
      // מאתחל את הקטגוריות על פי סוג העמוד
      this.initCategoryByType(this.action.actionType);
    }
  }

  /**
   * הפונקציה מאחלת את כל הפעולות ומפעילה את הפונקציה שממיינת את כל הפעולות ע"פ הלקוח שמחובר.
   */
  initAllActions() {
    if (this.myService.allTheActionsInTheDB == null) {
      this.myService.getAllTheAction().subscribe(
        (res) => {
          this.myService.allTheActionsInTheDB = res;
          this.initActionOfTheCustomer();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.initActionOfTheCustomer();
    }
  }

  /**
 * הפונקציה תאתחל את מערך הפעולות בשרת הלקוחות במידה והוא ריק.
 * ואת המידע שיוצג למשתמש אודות הוצאות בחודש הנוכחי.
 */
  private initActionOfTheCustomer() {
    // בדיקה האם הפעולות מאותחלות בשרת הלקוחות.
    if (this.myService.allActions == null) {
      // במידה ולא, נתאחל אותם
      this.myService.getAllActionsOftheCustomer(this.myService.customer, this.myService.allTheActionsInTheDB).subscribe(
        (res) => {
          this.myService.allActions = res;
          // לאחר שהפעולות אותחלו נפעיל פונקציה המתאחלת את המידע שנציג ללקוח על ההוצאות שכבר ביצע.
          this.getInfoAboutThisMonth();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      // במידה והפעולות קיימות נתאחל את המידע.
      this.getInfoAboutThisMonth();
    }
  }

  /**
   * הפונקציה תאתחל את מערך המשתמשים הפעילים,
   *  ותגדיר את המשתמש הראשון ברשימה כמשתמש שביצע ההוצאה.
   */
  private initActiveUser() {
    // נבדוק אם הלקוח בכלל מאוחתל בשרת הלקוחות.
    if (this.myService.customer == null) {
      // אם הוא לא , נתאחל אותו.
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          // אתחול הלקוח
          this.myService.customer = res;
          // איתחול כל הלקוחות הפעילים.
          this.initAllActions();
          this.activeUsers = this.getActiveUsersOfTheCustomer(this.myService.customer);
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      // במידה והלקוח קיים בבסיס הנתונים , איתחול רשימת המשתמשים.
      this.activeUsers = this.getActiveUsersOfTheCustomer(this.myService.customer);
      this.initAllActions();
    }
  }

  /**
   * הפונקציה תאתחל את מערך הקטגוריות בקטגרויות פעילות על פי סוג הקטגוריה שהתקבלה כארגומנט.
   * ותגדיר את הקטגוריה הראשונה כקטגוריה אליה תהייה משוייכת ההוצאה
   * @param type - סוג הקטגוריה 
   */
  private initCategoryByType(type: string) {
    // בדיקה האם הקטגוריות מאותחלת בשרת הלקוחות.
    if (this.myService.allCategories == null) {
      // במידה ולא, איתחול הקטגוריות.
      this.myService.getCategories().subscribe(
        (res) => {
          this.myService.allCategories = res;
          // איתחול מערך הקטגוריות.
          this.categories = [];
          // הוספת הקטגוריות הפעילות שסוגן תואם לסוג שהתקבל.
          this.myService.allCategories.forEach(category => {
            if (category.type == type && category.active == true) {
              this.categories.push(category);
            }
          })
          // אם קיים לפחות אובייקט אחד במערך הקטגוריות הוא יוגדר כקטגוריה של ההוצאה.
          if (this.categories[0] != null) {
            this.selectCategory(this.categories[0]);
          }
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      // אם הקטגוריות קיימות אצל שרת הלקוחות 
      // נתאחל בהם את מערל הקטגוריות המחלקתי.
      this.categories = [];
      this.myService.allCategories.forEach(category => {
        if (category.type == type && category.active == true) {
          this.categories.push(category);
        }
      })
      // אם קיים לפחות אובייקט אחד במערך הקטגוריות הוא יוגדר כקטגוריה של ההוצאה.
      if (this.categories[0] != null) {
        this.selectCategory(this.categories[0]);
      }
    }
  }

  /**
   * הפונקציה מתאחלת את אמצעי התשלום הפעילים,
   * ומגדירה את אמצעי התשלום הראשון ברשימה כאמצעי דרכו בוצעה ההוצאה.
   */
  private initActiveMethodPayment() {
    // בדיקה האם הלקוח אותחל בשרת הלקוחות.
    if (this.myService.customer == null) {
      // אם לא, נתאחל את הלקוח.
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          this.myService.customer = res;
          // איתחול רשימת אמצעי התשלום הפעילה.
          this.activeMethodPayments = this.getActiveMethodPaymentsOfTheCustomer(this.myService.customer);
          this.initAllActions();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      // אם הלקוח מאותחך כבר , נתאחל את רשימת אמצעי התשלום שלו.
      this.activeMethodPayments = this.getActiveMethodPaymentsOfTheCustomer(this.myService.customer);
      this.initAllActions();
    }
  }

  /** הפונקציה תופעל כשאר המשתמש יבחר לעבור אל עמוד ניהול המשתמשים */
  public moveToUserPage() {
    this.router.navigate(["/user"]);
  }

  /** הפונקציה תופעל כאשר המשתמש יבחר לעבור אל עמוד ניהול אמצעי התשלום. */
  public moveToMethodPaymenyPage() {
    this.router.navigate(["/methodPayment"])
  }

  /**הפונקציה תופעל כאשר המשתמש יבחר לעבור אל עמוד הוספת הכנסות */
  public moveToIncomePage() {
    this.router.navigate(['/addIncome']);
  }

  /** הפונקציה תופעל כאשר הלקוח יסמן קטגוריה כקטגוריה אךיה משוייכת ההוצאה שהוא מוסיף. */
  public selectCategory(category: Category) {
    this.action.category.id = category.id;
    this.action.category.name = category.name;
    this.action.category.active = category.active;
    this.action.category.type = category.type;
    this.action.category.description = category.description;
    this.action.category.usedTotal = category.usedTotal;
  }

  /** הפונקציה תופעל רגע לפני הוספת ההוצאה אל בסיס הנתונים.
   * כשהלקוח בוחר את אמצעי התשלום דרכו הוא שילם, הוא מודיע לפעולה רק מה המזהה של אותו אמצעי תשלום 
   * ולא נותן לא את כל הפרטים על האמצעי, לכן הפונקציה הזאת תופעל לפני ההוספה ותשלים את הפרטים החסרים של אמצעי התשלום.
   */
  private setMpById(methodPayment: MethodPayment) {
    this.activeMethodPayments.forEach(mp => {
      if (mp.id == methodPayment.id) {
        methodPayment.id = mp.id;
        methodPayment.name = mp.name;
        methodPayment.debitDate = mp.debitDate;
        methodPayment.active = mp.active;
      }
    })
  }

  /** הפונקציה תופעל רגע לפני הוספת ההוצאה אל בסיס הנתונים.
   * כשהלקוח בוחר את המשתמש שביצע את ההוצאה, הוא מודיע לפעולה רק מה המזהה של אותו משתמש 
   * ולא נותן לא את כל הפרטים של המשתמש, לכן הפונקציה הזאת תופעל לפני ההוספה ותשלים את הפרטים החסרים של המשתמש.
   */
  private setUserById(user: User) {
    this.activeUsers.forEach(u => {
      if (u.id == user.id) {
        user.id = u.id;
        user.name = u.name;
        user.active = u.active;
      }
    })
  }

  /**
   * הפונקציה שמוסיפה את ההוצאה אל בסיס הנתונים.
   * הפונקציה משלימה את השדות הריקים של הפעולה ומוסיפה את ההוצאה אל בסיס הנתונים.
   * לאחר ההוספה, המשתמש יועבר אל עמוד הבית.
   */
  public addExpense() {
    // השלמת הפרטים החסרים של אמצעי התשלום.
    this.setMpById(this.action.methodPayment);
    // השלמת הפרטים החסרים של המשתמש.
    this.setUserById(this.action.user);
    // אם המשתמש בחר שלא למלא כותרת, נתאחל אותה לכותרת ריקה.
    if (this.action.title == null) this.action.title = "";
    // הגדרת תאריך החיוב של ההוצאה בעזרת הפונקציה החיצונית.
    setDebitDate(this.action);
    // שליחת הבקשה שמוסיפה את ההוצאה.
    this.myService.addAction(this.action).subscribe(
      (res) => {
        // הוספה ידנית של הפעולה אל מערל כל הפעולות בשרת הלקוחות.
        this.myService.allActions.push(res);
        console.log(res)
        this.router.navigate(["/home"]);
      },
      (err) => { this.myService.HandlesErrors(err) }
    )

  }

  /**
   * פונקציה שמקבלת לקוח, מחזירה מערך של כל המשתמשים שברשותו של הלקוח
   * ומתאחלת את הפעולה בלקוח הראשון שנמצא ברשימה, אם הוא קיים.
   * @param customer הלקוח ממנו הפונקציה תיקח את המשתמשים.
   */
  private getActiveUsersOfTheCustomer(customer: Customer): User[] {
    // רשימת המשתשמשים שתחזור.
    let activeUsers: User[] = [];
    // איתחול הרשימה רק בלקוחות הפעילים
    customer.users.forEach(user => {
      if (user.active == true) {
        activeUsers.push(user);
      }
    })
    // במידה והמשתמש הראשון קיים, נתתחל את המשתמש של הפעולה בו.
    if (activeUsers[0] != null) {
      this.action.user.id = activeUsers[0].id;
    }
    return activeUsers;
  }

  /**
   * הפונקציה מקבלת לקוח, ומחזירה מערך של כל אמצעי התשלום הפעילים ברשותו של הלקוח.
   * בנוסף, היא מגדירה את האמצעי התשלום הראשון ברשימה, אם קיים, כאמצעי ממנו בוצעה הפעולה.
   * @param customer הלקוח ממנו הפונקציה תיקח את אמצעי התשלום.
   */
  private getActiveMethodPaymentsOfTheCustomer(customer: Customer): MethodPayment[] {
    // מערך אמצעי התשלום שהפונקציה תחזיר.
    let mps: MethodPayment[] = [];
    customer.methodPayments.forEach(mp => {
      if (mp.active) {
        mps.push(mp);
      }
    })
    // במידה ואמצעי התשלום הראשון ברשימה קיים, נתאחל את אמצעי התשלום של הפעולה בו.
    if (mps[0] != null) {
      this.action.methodPayment.id = mps[0].id;
    }
    return mps;
  }



  /**
   * הפונקציה פונה אל שרת הלקוחות ומתאחלת מידע אודות הההוצאות שהמשתמש ביצע בחודש הנוכחי.
   */
  private getInfoAboutThisMonth() {
    // קבלת החודש והשנה הנוכחים.
    let thisMonth = new Date().getMonth() + 1;
    let thisYear = new Date().getFullYear();
    // אתחול הנתונים שנרצה להציג ללקוח.
    this.totleExpense = 0;
    this.expenseThisMonth = 0;
    this.expenseNextMonth = 0;
    // מעבר על כל הפעולות ששייכות ללקוח וסיווגם על פי הדרישה.
    this.myService.allActions.forEach(action => {
      if (action.actionType == this.action.actionType) {
        let actionDate = new Date(action.actionDate);
        let debitDate = new Date(action.debitDate);
        if ((actionDate.getFullYear() == thisYear) && (actionDate.getMonth() + 1 == thisMonth)) {
          this.totleExpense += action.amount;
          if (debitDate.getMonth() + 1 == thisMonth) {
            this.expenseThisMonth += action.amount;
          } else {
            this.expenseNextMonth += action.amount;
          }
        }
      }
    })
  }



}
