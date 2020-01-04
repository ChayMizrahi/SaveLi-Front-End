import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MethodPayment } from 'src/app/Share/Model/MethodPayment';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { leaveDown, leaveLeft, leaveRight, apperUp, showState, itemList } from 'src/app/Share/animation';
import { Action } from 'src/app/Share/Model/Action';
import { MpComponent } from 'src/app/CustomerComponents/method-payment/mp/mp.component';
import { displayDateHebrow } from 'src/app/Share/Functions/DisplayDate';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-method-payment',
  templateUrl: './method-payment.component.html',
  styleUrls: ['./method-payment.component.css'],
  animations: [
    leaveDown,
    leaveLeft,
    leaveRight,
    apperUp,
    showState,
    itemList
  ]
})
export class MethodPaymentComponent implements OnInit {

  // שדה שמראה לנו האם המשתשמש לחץ על הכפתור שמציג עור מידע.
  public MethodPaymentInfo: boolean = false;
  // שדה שמציין האם המשתמש בחר להוסיף עוד אמצעי תשלום.
  public create: boolean = false;
  /** השדה מציין האם המשתמש סיים לקורא את המידע שמופיע אם לא קיימים ברשותו אמצעי תשלום */
  public infoForNew: boolean = true;
  /** שדה שנותן אנדיקציה האם המשתמש בחר להוסיף אמצעי תשלום אם שם שכבר קיים  */
  nameAlreadyExists: boolean = true;
  /** שדה שמכיל את כל אמצעי התשלום שברשות הלקוח */
  public allMethodPayments: MethodPayment[];
  /** שדה שמכיל את כל הפעולות של המשתמש */
  public allActions: Action[];
  /** שדה שמכיל אמצעי תשלום ריק, שיתמלא בפרטים של אמצעי התשלום החדש. */
  public newMethodPayment: MethodPayment = new MethodPayment();
  /**שמכיל את תוכן ההודעה שמופיע במידה ו */
  public newNameMessage: string = "";
  /** שדה שמכיל את ההודעה שהבמשתמש יתקל לאחר שהצליח להוסיך אמצעי תשלום */
  public addMessage: string = "";

/**
 * הבנאי של המחלקה, מבצע הזרקה עצמאית של שרת הלקוחות ושל הנתב.
 * @param router מאפשר לנו להעביר את המשתמש בין קומפוננטות
 * @param myService מאפשר לנו לגשת אל הפונקציות שנמצאות בשרת
 */
  constructor(private router: Router, private myService: DemoCustomerServiceService) {
    myService.initAllCustomers();
    myService.initAllActions();
   }

  /**
   * פונקציה שתופעל מייד לאחר יצירת הבנאי.
   * הפונקציה תפעיל את הפונקציות שאחראיות על אתחול המידע על כל אמצעי התשלום ועל כל הפעולות.
   */
  ngOnInit() {
    this.initData();
  }

  initData(){
    if(this.myService.allCustomers == null){
      this.myService.getAllCustomers().subscribe(
        (res)=>{
          this.myService.allCustomers = res;
          this.initAllMethodPayment();
        }
      )
    }else{
      this.initAllMethodPayment();
    }
  }
  
  /**
   * הפונקציה אחראית על איתחול אמצעי התשלום.
   * הפונקציה תבדוק האם השדה 'לקוח' קיים בשרת הלקוחות, אם כן היא תיקח ממנו את כל אמצעי התשלום שלו.
   * אחרת, היא תאחל אותו ואז תיקח ממנו את אמצעי התשלום.
   */
  initAllMethodPayment() {
    if (this.myService.customer == null) {
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          this.myService.customer = res;
          this.allMethodPayments = this.myService.customer.methodPayments;
          this.allMethodPayments.length == 0 ? this.MethodPaymentInfo = true : this.MethodPaymentInfo = false;
          this.initAllTheActionDB();  
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allMethodPayments = this.myService.customer.methodPayments;
      this.allMethodPayments.length == 0 ? this.MethodPaymentInfo = true : this.MethodPaymentInfo = false;
      this.initAllTheActionDB();  
    }
  }

initAllTheActionDB(){
  if(this.myService.allTheActionsInTheDB == null){
    this.myService.getAllTheAction().subscribe(
      (res)=>{
        this.myService.allTheActionsInTheDB = res;
        this.initAllActions();
      },
      (err)=>{ this.myService.HandlesErrors(err) }
    )
  }else{
    this.initAllActions();
  }

}

  /**
   * פונקציה שאחראית על אתחול כל הפעולות של הלקוח.
   * הפונקציה תחילה תבדוק האם השדה 'כל הפעולות' אותחל בשרת הלקוחות.
   * אם הוא כבר אותחל היא תיקח ממנו את כל הפעולותת אחרת, היא תאתחל אותו ואז תיקח.
   */
  initAllActions() {
    if (this.myService.allActions == null) {
      this.myService.getAllActionsOftheCustomer(this.myService.customer, this.myService.allTheActionsInTheDB).subscribe(
        (res) => {
          this.myService.allActions = res;
          this.allActions = this.myService.allActions;
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.allActions = this.myService.allActions;
    }
  }

  /**
   * הפונקציה מופעלת כאשר הלקוח נמצא בשלב בו אין ברשותו אמצעי תשלום והוא בוחר להוסיך אמצעי תשלום חדש.
   *  היא תעביר אותו את המסך בו ניתן להוסיך אמצעי תשלום על פי סוג אמצעי התשלום שבחר.
   * @param cash סוג אמצעי התשלום. אמת-חיוב מיידי, שקר- חיוב חודשי.
   */
  finishInfoNewAndAddMp(cash: boolean) {
    this.infoForNew = false;
    this.newMethodPayment.active = true;
    this.newMethodPayment.debitDate = 0;
  }

  /** כפתור עליו לוקח המשתמש כדי להוסיך אמצעי תשלום חדש לאחר שכבר קיימים ברשותו אמצעי תשלום. */
  openAddByCash() {
    this.MethodPaymentInfo = false;
    this.create = true;
    this.newMethodPayment.active = true;
    this.newMethodPayment.debitDate = 0;
  }

  /**
   * כפתור עליו לוקח המשתמש כדי לקבל מידע על אמצעי התשלום.
   */
  openInfo() {
    this.MethodPaymentInfo = true;
    this.create = false;
  }


  /**
   * פונקציה אשר מקבלת כארגומנט מזהה של אמצעי תשלום
   * ומחזירה מערך של כל הפעולות שרשומות על שמו על אמצעי התשלום.
   * @param id המזהה של אמצעי התשלום.
   */
  getActionsByMpId(id: number): Action[] {
    let actionsByMp: Action[] = [];
    this.myService.allActions.forEach(action => {
      if (action.methodPayment.id == id) {
        actionsByMp.push(action);
      }
    })
    return actionsByMp;
  }

  /**
   * פונקציה שמקבלת מזהה של אמצעי תשלום
   * ומחזירה מערך של כל השמות של שאר אמצעי התשלום.
   * הפונקציה חיונית לרגע בו הלקוח יעדכן את של אמצעי התשלום ותעזור לנו למנוע כפל שמות.
   * @param id מזהה אמצעי התשלום.
   */
  getOtherNamesById(id: number): string[] {
    let names: string[] = [];
    this.allMethodPayments.forEach(mp => {
      if (mp.id != id) {
        names.push(mp.name);
      }
    })
    return names;
  }

  /**פונקציה שמוסיפה את אמצעי התשלום החדש אל בסיס הנתונים. */
  addMethodPayment() {
    this.newMethodPayment.debitDate = Number(this.newMethodPayment.debitDate);
    this.myService.addMethodPayment(this.newMethodPayment).subscribe(
      (res) => {
        this.myService.customer.methodPayments.unshift(res);
        this.newMethodPayment = new MethodPayment();
        this.addMessage = "אמצעי תשלום התווסף בהצלחה";
        this.create = false;
        setTimeout(() => {
          this.addMessage = "";
        }, 5000)
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * פונקציה שבודקת אם השם שניתן לאמצעי התשלום החדש לא קיים כבר אבל אמצעי תשלום אחר.
   * @param name שם אמצעי התשלום החדש.
   */
  checkIfNewNameAlreadyExists(name: string) {
    let ans: boolean = false;
    this.newNameMessage = "";
    this.allMethodPayments.forEach(m => {
      if (m.name.toLowerCase() == name.toLowerCase()) {
        ans = true;
        this.newNameMessage = "שם זה כבר קיים , אנא בחר בשם אחר..";
      }
    })
    return ans;
  }

  /**
   * פונקציה שמעדכנת אמצעי תשלום בבסיס הנתונים.
   * @param mp אמצעי התשלום לאחר העדכון.
   * @param index מיקום אמצעי התשלום במערך אמצעי התשלום.
   */
  public updateMethodPayment(mp: MethodPayment, index: number) {
    this.myService.updateMethodPayment(mp).subscribe(
      (res) => {
        this.myService.customer.methodPayments[index] = res;
        this.allMethodPayments = this.myService.customer.methodPayments;
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /** 
   * פונקציה שמוחקת את אמצעי התשלום מבסיס הנתונים.
   */
  public removeMethodPayment(mpId: number, index: number) {
    this.myService.removeMethodPayment(mpId).subscribe(
      (res) => {
        this.myService.customer.methodPayments.splice(index, 1);
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * פונקציה שמעבירה את הלקוח אל עמוד הפעולות של אמצעי התשלום.
   * @param id 
   */
  moveToActionsMp(id: number) {
    let byDebit:string; 
    let year:number;
    let month:number;
    let lastAction = this.getActionsByMpId(id).sort((a,b)=>{return b.id - a.id})[0];
    this.allMethodPayments.forEach(mp=>{
      if(mp.id == id){
        if(mp.debitDate == 0 ){
          byDebit = "action";
        }else{
          byDebit = "debit";
        }
      }
    })
    if(byDebit == "action"){
      year = new Date(lastAction.actionDate).getFullYear();
      month = new Date(lastAction.actionDate).getMonth()+1;
    }
    if(byDebit == "debit"){
      year = new Date(lastAction.debitDate).getFullYear();
      month = new Date(lastAction.debitDate).getMonth()+1;
    }
    
    this.router.navigate(["action/methodPayment/"+id+"/"+year+"/"+month+"/"+byDebit]);
  }

  /**
   * פונקציה שמעבירה את המשתמש אל עמוד ההוצאות
   */
  moveToExpense() {
    this.router.navigate(["addExpense"]);
  }

  /**
   * פונקציה שמעבירה את המשתמש אל עמוד ההכנסות
   */
  moveToIncome() {
    this.router.navigate(["addIncome"])
  }
}
