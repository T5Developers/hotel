import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  userPhonenumber="";

  orderDetails={
    "orderId":"",
    "phoneNumber":"",
    "address":""
  }
  catagoryList;
}
