import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/Share/Model/Customer';
import { LoginService } from 'src/app/Share/Services/login.service';
import { User } from 'src/app/Share/Model/User';
import { MethodPayment } from 'src/app/Share/Model/MethodPayment';
import { Router } from '@angular/router';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { TranslationWidth } from '@angular/common';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  /** The field that contain the new customer */
  public customer: Customer = new Customer();
  /** The field that contain the second password, necessary for confirm password.  */
  public confirmPassword: string;
  /** Field that indicating if the email that recived form the user already exists */
  public emailNotUniqe: boolean = true;
  /** Field that indicating if the password didn't match */
  public passwordNotConfirm: boolean = true;


  /**
   * The constructor of the class, inizalizes the fiekd user of customer.
   * Make indenpendent injection of loginService and Router. 
   * @param loginService - allow as to access to the functions in loginService.
   * @param router - allow us to moved the user between compontent.
   */
  constructor(public loginService: DemoLoginService, private router: Router) {
    this.customer.users[0] = new User();
  }

  ngOnInit() {

  }

  public submitRegistration() {
    if (this.loginService.registation(this.customer)) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginType', 'CUSTOMER')
      this.loginService.checkLoggedInAndInitLoginType();
      this.loginService.allEmails.push(this.customer.email);
      this.router.navigate(['/home']);
    }
  }

  /**
   * The function will be trigger when the user click to submit the registrationform.
   * If the registration succeeds details will be defined about the customer in the local storage and the customer will be moved to the home page.
   
  // כשיש שרת אמיתי
  public submitRegistration() {
    this.loginService.registation(this.customer).subscribe(
      (res) => {
        if (res) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('loginType', 'CUSTOMER')
          this.loginService.checkLoggedInAndInitLoginType();
          this.loginService.allEmails.push(this.customer.email);
          this.router.navigate(['/home']);
        } else {
          alert("הרישום לא הצליח אנא נסה שנית או פנה למנהל המערכת")
        }
      },
      (err) => { this.loginService.HandlesErrors(err) }
    )
  }
  */

  /**
   * The function will be triggerd when the client finish to insert the email, 
   * and it will checks if the email already exists to the other customer.
   * If the email alredy exists the field emailNotUniqe will be true, if not false.
   * If the email contain the word admin the emailNotUniqe will be true.
   */
  public checkIfEmailUnieq() {
    if (this.customer.email != null) {
      this.emailNotUniqe = false;
      this.loginService.allEmails.forEach(email => {
        if (email == this.customer.email) {
          this.emailNotUniqe = true;
          return;
        }
      })
    }
  }

  /**
   * The function will be trigger when the user finish the input the second password,
   * and checks if the first password equals to the second password.
   */
  public checkPassword() {
    if (this.confirmPassword == this.customer.password) {
      this.passwordNotConfirm = false;
    } else {
      this.passwordNotConfirm = true;
    }
  }





}
