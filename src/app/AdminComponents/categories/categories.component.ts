import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/Share/Services/admin.service';
import { Category } from 'src/app/Share/Model/Category';
import { actionTypeFormEnglishToHebrew, activeOrInactiveFormEnglishToHebrew } from 'src/app/Share/Functions/EnglishToHebrew';
import { sortByName, sortByDes, sortByUesdTotle, sortByType, sortByActive } from 'src/app/Share/Functions/CategorySort';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  // Indicates whether to display info about the category. 
  public getInfo: boolean = false;
  // Indicates whether to display a category insert line.
  public addNew: boolean = false;
  // An array that contains all the categories that exist in the database
  public allCategories: Category[];
  // An object to initialize in the category data that the user chooses to update
  public updateCategory: Category;
  //An object to initialize in the category data that the user chooses to add
  public addCategory: Category = new Category();
  //An object representing the position of a category in an array containing all categories in the data base.
  public makeUpdate: number = -1;
  //Allows us to run the functions in the html document
  public actionTypeFormEnglishToHebrew: Function = actionTypeFormEnglishToHebrew;
  //Allows us to run the functions in the html document
  public activeOrInactiveFormEnglishToHebrew: Function = activeOrInactiveFormEnglishToHebrew;

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
    this.initAllCategories();
  }

  /**
   * The function takes all categories from the database from the server and initializes the allCategories object in the whole category
   */
  public initAllCategories() {
    this.myService.getAllCategories().subscribe(
      (res) => { this.allCategories = res },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * The function is activated as soon as the user chooses to update a category.
   * The function will initialize the makeUpdate object by the number of the selected object in the stack of all categories.
   * And the updateAction object in the details of the selected object.  
   * @param i Position the object in the allCategories array
   * 
   */
  public startUpdate(i: number) {
    this.makeUpdate = i;
    this.updateCategory = new Category();
    this.updateCategory.id = this.allCategories[i].id;
    this.updateCategory.name = this.allCategories[i].name;
    this.updateCategory.description = this.allCategories[i].description;
    this.updateCategory.active = this.allCategories[i].active;
    this.updateCategory.type = this.allCategories[i].type;
    this.updateCategory.usedTotal = this.allCategories[i].usedTotal;
  }

  /**
   * The function will be activated when the user finishes updating a category.
   * The function updates the categorical items for the updateCategory object information in the database
   */
  public finishUpdate() {
    console.log(this.updateCategory)
    this.myService.updateCategory(this.updateCategory).subscribe(
      (res) => {
        this.initAllCategories();
        this.makeUpdate = -1
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * The function will be triggered when the user undoes a category update.
   */
  public cancelUpdate() {
    this.updateCategory = this.allCategories[this.makeUpdate];
    this.makeUpdate = -1;
  }


  /**
   * The function will run when the rest of the user finishes adding a new category.
   */
  public finishAdd() {
    this.addCategory.active = true;
    this.addCategory.usedTotal = 0;
    this.myService.addCategory(this.addCategory).subscribe(
      (res) => {
        this.initAllCategories();
        this.addCategory = new Category();
        this.addNew = false
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }

  /**
   * The function will delete the category whose identifier was accepted as an argument from the database.
   * And update the allCategory object
   */
  public removeCategory(id: number) {
    this.myService.removeCategory(id).subscribe(
      (res) => {
        alert("קטגוריה נמחקה בהצלחה");
        this.initAllCategories()
      },
      (err) => { this.myService.HandlesErrors(err) }
    )
  }


  /**
   * The function will sort the array of all categories by the function field you will receive as an argument.
   * @param by The field according to the array will be sorted
   */
  public sortCategory(by: string) {
    switch (by) {
      case 'name':
        sortByName(this.allCategories);
        break;
      case 'description':
        sortByDes(this.allCategories);
        break;
      case 'usedTotal':
        sortByUesdTotle(this.allCategories);
        break;
      case 'type':
        sortByType(this.allCategories);
        break;
      case 'active':
        sortByActive(this.allCategories);
        break;
      default:
        break;
    }
  }


}
