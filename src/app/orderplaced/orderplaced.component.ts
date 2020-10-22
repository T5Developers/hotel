import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
@Component({
  selector: 'app-orderplaced',
  templateUrl: './orderplaced.component.html',
  styleUrls: ['./orderplaced.component.scss']
})
export class OrderplacedComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }
  orderD = JSON.parse(localStorage.getItem("OrderDetails"));

  // orid = this.orderD.CustomerID;
  // phnum = this.orderD.Phonenumber;
  // addr = this.orderD.Address;
  logincheck=true;
  orid = this.dataService.orderDetails.orderId;
  phnum = this.dataService.orderDetails.phoneNumber;
  addr = this.dataService.orderDetails.address;

  ngOnInit() {
    if(this.logincheck != true){
      this.router.navigate([{ outlets: { auth: ['userlogin'] } }]);
    }
  }
  homescreen() {
    this.router.navigate([{ outlets: { main: ['itemlist'] } }]);
  }
}
