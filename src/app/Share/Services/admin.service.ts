import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../Model/Customer';
import { Observable } from 'rxjs';
import { Category } from '../Model/Category';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  /**
   * Performs independent injection of httpClient and loginSerive.
   * @param httpClient 
   * @param loginSerive 
   */
  constructor(private httpClient: HttpClient, private loginSerive: LoginService) { }

  /**
   * The function appeals to the server and returns Observable containing all clients registered in the database.
   */
  public getAllCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>("moneyManager/admin/customer");
  }

  /**
   * The function receives a number that represents a customer ID.
   * And sends a GET request to the server that is intended to receive the client whose ID was received from the database.
   * The function returns a Observable object that contains the received client.
   * @param id 
   */
  public getCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>("moneyManager/admin/customer/" + id);
  }

  /**
   * The function sends a POST request to the server and inside it a customer type object. The object will be added to the database.
   * When added, the function returns a Observable object containing the client added to the database.
   * @param customer The customer will be added to the database
   */
  public addCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>("moneyManager/admin/customer", customer);
  }

  /**
   * The function accepts which client already exists in the database.
   * And sends a PUT request to the server to update the received client.
   * The function returns a Observable object that contains the client after the update.
   * @param customer 
   */
  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>("moneyManager/admin/customer", customer);
  }

  /**
   * The function receives a number that represents a customer ID.
   * And sends a DELETE request to the server to delete the client whose ID was received from the database
   * @param id 
   */
  public removeCustomer(id: number): Observable<void> {
    return this.httpClient.delete<void>("moneyManager/admin/customer/" + id);
  }

  /**
   * The function appeals to the server and returns Observable containing all categories exists in the database.
   */
  public getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>("moneyManager/admin/category");
  }

  /**
   * The function accepts a category and sends a POST request to the server that aims to add the received category to the database.
   * The function returns a Observable object that contains the category after insertion.
   * @param category 
   */
  public addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>("moneyManager/admin/category", category);
  }

  /**
   * The function accepts a category and sends a PUT request to the server that aims to update the category received in the database.
   * The function returns a Observable object that contains the category after the update.
   */
  public updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>("moneyManager/admin/category", category);
  }

  /**
   * The function accepts a number representing a category ID and sends a DELETE request to the server that aims to delete the category whose ID is equal to the received ID.
   */
  public removeCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>("moneyManager/admin/category/" + id);
  }












  

  public HandlesErrors(err: HttpErrorResponse) {
    this.loginSerive.HandlesErrors(err);
  }

}
