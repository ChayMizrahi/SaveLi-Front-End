import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LoginService } from 'src/app/Share/Services/login.service';
import { CustomerService } from 'src/app/Share/Services/customer.service';
import { DemoCustomerServiceService } from 'src/app/Share/Services/demo-customer.service';
import { DemoLoginService } from 'src/app/Share/Services/demo-login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  constructor(public loginServive:DemoLoginService,public customerService:DemoCustomerServiceService) { 
  }

  ngOnInit() {
    this.loginServive.checkLoggedInAndInitLoginType();
  }
}
