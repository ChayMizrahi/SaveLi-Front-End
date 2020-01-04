import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/Share/Model/Customer';
import { AdminService } from 'src/app/Share/Services/admin.service';
import { MethodPayment } from 'src/app/Share/Model/MethodPayment';
import { User } from 'src/app/Share/Model/User';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  // Indicates whether to display info about the customers. 
  public getInfo: boolean = false
  // An array that contains all the customers that exist in the database
  public allCustomers: Customer[];
  // An object to initialize in the customer data that the user chooses to update
  public updateCustomer: Customer;
  //An object representing the position of a customer in an array containing all customers in the data base.
  public makeUpdate: number = -1;

  public updateMessage:string = "";

  /**
   * A class constructor does an independent injection for admin service
   * @param myService 
   */
  constructor(private myService: AdminService) {
  }

  /**
   * A function that runs immediately after the class loads and activates the function initAllCategories.
   */
  ngOnInit() {
    this.iniAllCustomers();
  }

  /**
   * The function takes all customers from the database from the server and initializes the allCategories object in the whole category
   */
  public iniAllCustomers() {
    this.myService.getAllCustomers().subscribe(
      (res) => { this.allCustomers = res },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * The function is activated as soon as the user chooses to update a customer.
   * The function will initialize the makeUpdate object by the number of the selected object in the stack of all customers.
   * And the updateCustomer object in the details of the selected object.  
   * @param i Position the object in the allCustomers array
   * 
   */
  public startUpdate(i: number) {
    this.makeUpdate = i;
    this.updateCustomer = new Customer();
    this.updateCustomer.id = this.allCustomers[i].id;
    this.updateCustomer.email = this.allCustomers[i].email;
    this.updateCustomer.password = this.allCustomers[i].password;
  }

  /**
   * The function will be activated when the user finishes updating a customer.
   * The function updates the customer items for the updateCustomer object information in the database
   */
  public finishUpdate() {
    if(this.confirmIsAdmin()){
      this.myService.updateCustomer(this.updateCustomer).subscribe(
        (res) => {
          this.iniAllCustomers();
          this.makeUpdate = -1
        },
        (err) => { this.myService.HandlesErrors(err) }
      )
    }
  }

  /**
   * The function will be triggered when the user undoes a customer update.
   */
  public cancelUpdate() {
    this.updateCustomer = this.allCustomers[this.makeUpdate];
    this.makeUpdate = -1;
  }

  /**
   * The function will delete the customer whose identifier was accepted as an argument from the database.
   * And update the allCustomers object
   */
  public removeCustomer(id: number) {
    if(this.confirmIsAdmin()){
    this.myService.removeCustomer(id).subscribe(
      (res) => {
        alert("לקוח נמחק בהצלחה");
        this.iniAllCustomers()
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }
  }

/**
 * The function asks the user an open-ended question with one answer, if he answers correctly the function returns true and if it does not return a false one.
 */
public confirmIsAdmin():boolean{
  let ans:string = prompt("איפה גדלת ?");
  if(ans == 'רימונים'){
    alert("צודק")
    return true;
  }else{
    alert("טעות")
    return false
  }
}

}
