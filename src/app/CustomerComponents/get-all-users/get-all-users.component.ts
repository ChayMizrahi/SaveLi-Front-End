import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Share/Model/User';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { Router } from '@angular/router';
import { showState } from 'src/app/Share/animation';
import { Action } from 'src/app/Share/Model/Action';
import { displayDateHebrow } from 'src/app/Share/Functions/DisplayDate';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';

@Component({
  selector: 'app-get-all-users',
  templateUrl: './get-all-users.component.html',
  styleUrls: ['./get-all-users.component.css'],
  animations: [
    showState
  ]
})
export class GetAllUsersComponent implements OnInit {

  /** רשימה של כל המשתמשים שקיימים בבסיס הנתונים.*/
  public users: User[];
  /** רשימה של כל הפעולות שרשמו על שמו של הלקוח שקיימות בבסיס הנתונים. */
  public allActions: Action[];
  /** משתמשים ריק ששדותיו יאותחלו ברגע שהלקוח שיוסיף משתמש חדש. */
  public newUser: User = new User();
  /** משתמש ריק שיאחותל בפרטיו של משתמש שנבחר לעדכון  */
  public updateToUser: User = new User();
  /** מהווה אינדיקציה האם הלקוח רוצה לצפות במידע על הלקוחות או שלא. */
  public userInfo: boolean = false;
  public create: boolean = false;
  /** מהווה אינדיקציה איזה משתמש מסומן כרגע. */
  public markedUserIndex: number;
  /** מהווה אינדיצקיה אם השם של המשתמש שנבחר לעדכן כבר קיים אצל משתמש אחר. */
  public updateNameNotUniqe: boolean = false;
  /** מהווה אינדיקציה האם השם של המשתמש שעתיד להתווסף כבר קיים אצל משתמש אחר ברשותו של הלקוח */
  public addNameNotUniqe: boolean = false;
  /** מספר המייצג את מיקום המשתמש במערך כל המשתמשים, יכיל את מיקום המשתמש שהלקוח בחר לעדכן */
  public selectedToUpdate: number = -1;
  displayDateHebrow: Function = displayDateHebrow;

  /**
   * בנאי הקומפוננטה - מבצע הזרקה עצמאית של שרת הלקוחות והנתיב.
   * @param myService - יאפשר לבצע לבצע פונקציות בצד שרת הקשורות שך הלקוח.
   * @param router - יאפשר לנו לבצע מעבר בין הקומפוננטות.
   */
  constructor(private myService: DemoCustomerServiceService, private router: Router) {
    myService.initAllCustomers();
    myService.initAllActions();
  }

  /**
   * פונקציה שתופעל מייד לאחר יצירת הבנאי.
   */
  ngOnInit() {
    this.initDate();
  }

  initDate(){
    if(this.myService.allCustomers == null){
      this.myService.getAllCustomers().subscribe(
        (res)=>{
          this.myService.allCustomers = res;
          this.initAllUsers();
        }
      )
    }else{
      this.initAllUsers();
    }
  }

  /**
   * מאתחל את השדה שמכיל את כל המשתמשים שבבסיס הנתונים.
   */
  public initAllUsers() {
    if (this.myService.customer == null) {
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res) => {
          this.myService.customer = res;
          this.users = this.myService.customer.users
          this.initAllTheActionsDB();
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    } else {
      this.users = this.myService.customer.users;
      this.initAllTheActionsDB();
    }
  }

  initAllTheActionsDB(){
    if(this.myService.allTheActionsInTheDB == null){
      this.myService.getAllTheAction().subscribe(
        (res)=>{
          this.myService.allTheActionsInTheDB = res;
          this.initAllActions();
        }
      )
    }else{
      this.initAllActions();
    }
  }

  /**
   * מאתחל את השדה שמכיל את כל הפעולות שביצע המשתמש שמחובר.
   */
  public initAllActions() {
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
   * הפונקציה מחזירה מערך של כל הפעולות שבוצעו על ידי המשתמש שהמזהה שלו התקבל.
   * @param userId המזהה של המשתמש
   */
  getActionByUserId(userId: number): Action[] {
    let userActions: Action[] = [];
    this.allActions.forEach(action => {
      if (action.user.id == userId) {
        userActions.push(action);
      }
    })
    return userActions;
  }

  /**
   * פונקציה שתופעל ברגע שהמשתמש ילחץ על הכפתור "הוסף משתמש" 
   */
  public addUser() {
    this.addNameNotUniqe = false;
    this.newUser.active = true;
    if (!this.checkIfUserNameExistsWhenCreate(this.newUser.name)) {
      this.myService.addUser(this.newUser).subscribe(
        (res) => {
          this.myService.customer.users.push(res);
          this.create = false;
          this.newUser = new User();
          console.log(res)
        },
        (err) => (this.myService.HandlesErrors(err))
      )
    } else {
      this.addNameNotUniqe = true;
    }
  }

  public startUpdate(index: number) {
    this.updateToUser = new User();
    this.selectedToUpdate = index;
    this.updateToUser.id = this.users[index].id;
    this.updateToUser.name = this.users[index].name;
    this.updateToUser.active = this.users[index].active;
  }

  public finishUpdate(index: number) {
    this.updateNameNotUniqe = false;
    if (this.updateToUser.name != this.users[index].name) {
      this.users.forEach(u => {
        if ((u.id != this.updateToUser.id) && (this.updateToUser.name.toLowerCase() == u.name.toLowerCase())) {
          this.updateNameNotUniqe = true;
          return;
        }
      })
    }
    if (this.updateNameNotUniqe == false) {
      this.myService.updateUser(this.updateToUser).subscribe(
        (res) => {
          this.myService.customer.users.forEach(u => {
            if (u.id == res.id) {
              u = res;
            }
          })
          this.users[index] = res;
          this.selectedToUpdate = -1;
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  /**
   * הפונקציה מקבלת מיקום של משתמש במערך המשתמשים ומשנה את השדה פעיל אצלו לערך הנגדי שלו.
   * @param index מיקום המשתמש במערך כל המשתמשים
   */
  changeActive(index: number) {
    this.startUpdate(index);
    this.updateToUser.active = !this.updateToUser.active;
    this.myService.updateUser(this.updateToUser).subscribe(
      (res) => {
        this.myService.customer.users.forEach(u => {
          if (res.id === u.id) {
            u = res;
          }
        })
        this.users[index] = res;
        this.selectedToUpdate = -1;
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  public checkIfUserNameExistsWhenUpdate(userId: number, userName: string): boolean {
    let ans: boolean = false;
    this.users.forEach(u => {
      if (u.id != userId && u.name == userName) {
        ans = true;
      }
    });
    return ans;
  }

  public checkIfUserNameExistsWhenCreate(userName: string): boolean {
    let ans: boolean = false;
    this.users.forEach(u => {
      if (u.name.toLowerCase() == userName.toLowerCase()) {
        ans = true;
      }
    });
    return ans;
  }

  public checkIfUserHasActions(userName: string): boolean {
    let ans: boolean = false;
    this.allActions.forEach(a => {
      if (a.user.name == userName) {
        ans = true;
      }
    });
    return ans;
  }




  public removeUser(id: number, index:number) {
    this.myService.deleteUser(id).subscribe(
      (res) => {
        this.users.splice(index,1);
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }


  getThreeRecentActions(id: number) {
    let userActions: Action[] = this.getActionByUserId(id);
    return userActions.sort((a, b) => { return b.id - a.id }).slice(0, 3);
  }


  public updateUser(user: User, userName: string, userActive: boolean) {
    this.updateNameNotUniqe = false;
    if (userName == "") {
      user.active = userActive;
    } else {
      if (!this.checkIfUserNameExistsWhenUpdate(user.id, userName)) {
        user.name = userName
      } else {
        this.updateNameNotUniqe = true;
        return;
      }
    }
    this.myService.updateUser(user).subscribe(
      (res) => { this.initAllUsers() },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * פונקציה שמעבירה את הלקוח אל עמוד הפעולות של המשתמש.
   * @param id 
   */
  public moveToActionsUser(id: number) {
    let byDebit: string;
    let year: number;
    let month: number;
    let lastAction = this.getActionByUserId(id).sort((a, b) => { return b.id - a.id })[0];
    year = new Date(lastAction.actionDate).getFullYear();
    month = new Date(lastAction.actionDate).getMonth() + 1;
    byDebit = 'action';
    this.router.navigate(["action/user/" + id + "/" + year + "/" + month + "/" + byDebit]);
  }

}
