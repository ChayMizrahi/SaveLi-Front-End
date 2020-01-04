import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { Customer } from 'src/app/Share/Model/Customer';
import { showState } from 'src/app/Share/animation';
import { LoginService } from 'src/app/Share/Services/login.service';
import { Router } from '@angular/router';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';

@Component({
  selector: 'app-customer-setting',
  templateUrl: './customer-setting.component.html',
  styleUrls: ['./customer-setting.component.css'],
  animations: [
    showState
  ]
})
export class CustomerSettingComponent implements OnInit {

  public myCustomer: Customer;
  public changeEmail: string;
  public emailNotUniqe: boolean = true;
  public firstPassword: string;
  public secondPassword: string;

  constructor(private myService: DemoCustomerServiceService, private loginService: DemoLoginService, private router:Router) {
  }

  ngOnInit() {
    this.initData();
  }


  initData(){
    if(this.myService.allCustomers == null){
      this.myService.getAllCustomers().subscribe(
        (res)=>{
          this.myService.allCustomers = res;
          this.initCustomer();
        }
      )
    }else{
      this.initCustomer();
    }
  }

  initCustomer() {
    if(this.myService.customer == null){
      this.myService.getCustomer(this.myService.allCustomers).subscribe(
        (res)=>{
          this.myService.customer = res;
          this.myCustomer = this.myService.customer}
      )
    }else{
      this.myCustomer = this.myService.customer;
    }
  }

  checkIfEmailUniqe() {
    let ans: boolean;
    if (this.changeEmail == this.myCustomer.email) {
      ans = false;
    } else {
      this.loginService.allEmails.forEach(e => {
        if (e == this.changeEmail) {
          ans = true;
        }
      })
    }
    this.emailNotUniqe = ans;
  }

  updateEmail() {
    if (this.verifyCustomer()) {
      let ogirenEmail: string = this.myCustomer.email;
      this.myCustomer.email = this.changeEmail;
      this.myService.updateCustomer(this.myCustomer).subscribe(
        (res) => {
          this.myCustomer = res;
          this.updateEmailInLoginService(ogirenEmail, this.myCustomer.email);
          alert("כתובת המייל עודכנה בהצלחה");
          this.changeEmail = null;
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  updatePassword() {
    if (this.verifyCustomer()) {
      this.myCustomer.password = this.firstPassword;
      this.myService.updateCustomer(this.myCustomer).subscribe(
        (res) => {
          this.myCustomer = res;
          alert("עדכון הסיסמה הסתיים בהצלחה");
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  verifyCustomer(): boolean {
    let pass = prompt("הזן סיסמה:");
    if (pass != this.myCustomer.password) {
      alert('סיסמה שגיאה')
      return false;
    }
    return true;
  }

  updateEmailInLoginService(origenEmail: string, newEmail: string) {
    let i = this.loginService.allEmails.indexOf(origenEmail);
    if (i > -1) {
      this.loginService.allEmails[i] = newEmail;
    }
  }

  removeCustomer(){
    let ans:boolean = confirm("אם תסכים לפעולה זאת המשתמש ופרטיו ימחקו לצמיתות, האם בכל זאת להמשיך ?");
    if(ans){
      let password:string = prompt("מה הסיסמה של חשבון זה ?");
      if(password === this.myCustomer.password){
        this.myService.removeCustomer().subscribe(
          (res)=>{
            alert("המשתמש נמחק בהצלחה");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem('loginType');
            this.myService.customer = null;
            this.myService.allActions = null;
            this.router.navigate(["/home"])
          },
          (err)=>{this.myService.HandlesErrors(err)}
        )
      }else{
        alert("הסיסמה שגויה, פעולה נכשלה")
      }
    }
  }

}

