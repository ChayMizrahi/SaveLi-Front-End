import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/Share/Model/Category';
import { Customer } from 'src/app/Share/Model/Customer';
import { AdminService } from 'src/app/Share/Services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  // Allows us to know what time of day and by which to determine which title to display
  public hour = new Date().getHours();
  // Contains all customers that are in the database
  public allCustomers: Customer[];
  // Contains all categories that are in the database
  public allCategories: Category[];
  // Sets whether to display the 5 common or uncommon categories
  public byCommon: boolean = true;

  /**
   * Performs independent injection router and adminService.
   * @param myService - Allows us to run functions from the remote server
   * @param router - Allows us to switch between components
   */
  constructor(private myService: AdminService, private router: Router) {
  }

  /**
   * The function runs immediately after the constructor.
   * And activates the functions initAllCustomers and initAllCategories.
   */
  ngOnInit() {
    this.initAllCustomers();
    this.initAllCategories();
  }

  /**
   * The function runs the getAllCustomers function from the server.
   * And initializes the variable allCustomers in the results of the function
   */
  initAllCustomers() {
    this.myService.getAllCustomers().subscribe(
      (res) => { this.allCustomers = res },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * The function runs the getAllCategories function from the server.
   * And initializes the variable allCategories in the results of the function
   */
  initAllCategories() {
    this.myService.getAllCategories().subscribe(
      (res) => { this.allCategories = res },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * The function returns an array of the five clients with the highest identifier.
   */
  getMostNewCustomers(): Customer[] {
    let customers: Customer[] = this.allCustomers.slice();
    customers.sort((a, b) => {
      return b.id - a.id;
    })
    return customers.slice(0, 5);
  }

  /**
   * The function returns the number of categories that are type expense.
   */
  getAmountOfExpenesCategory(): number {
    let expenseCategory: Category[] = [];
    this.allCategories.forEach(c => {
      if (c.type == "EXPENSE") {
        expenseCategory.push(c);
      }
    });
    return expenseCategory.length;
  }

  /**
   * The function returns the number of categories that are type income.
   */
  getAmountOfIncomeCategory(): number {
    let incomeCategory: Category[] = [];
    this.allCategories.forEach(c => {
      if (c.type == "INCOME") {
        incomeCategory.push(c);
      }
    });
    return incomeCategory.length;
  }

  /**
   * The function returns a set of 5 categories that users use the most.
   */
  getMostCommon(): Category[] {
    let categories: Category[] = this.allCategories.slice();
    categories.sort((a, b) => {
      return b.usedTotal - a.usedTotal;
    })
    return categories.slice(0, 5);
  }

  /**
   * The function returns a set of 5 categories that users use the least.
   */
  getLessCommon(): Category[] {
    let categories: Category[] = this.allCategories.slice();
    categories.sort((a, b) => {
      return a.usedTotal - b.usedTotal;
    })
    return categories.slice(0, 5);
  }

  /**
   * The function takes the user to the customer management page
   */
  moveToCustomerPage() {
    this.router.navigate(["/customers"]);
  }

  /**
   * The function takes the user to the category management page
   */
  moveToCategoryPage() {
    this.router.navigate(["/categories"]);
  }
}
