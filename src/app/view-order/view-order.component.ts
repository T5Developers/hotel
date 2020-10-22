import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { RestAppService } from '../app.services';
import { DataserviceService } from '../dataservice.service';
import { DataService } from '../data.service';

declare var Razorpay: any;
@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  lstPlaceOrder: any;
  PaymentType: string;
  lstCustInfo: any;
  GST: number;
  GSTAmount: number;
  TableNo: number;

  constructor(private dataServ: DataService, private appservice: RestAppService, public dataService: DataserviceService, private router: Router) { }

  logincheck = true;
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate([{ outlets: { auth: ['userlogin'] } }]);
    }
    $(document).on("click", ".h-vo-ov", function () {
      $(".h-vo-pop").removeClass("h-open");
    });
    setTimeout(function () {
      var totalamt = 0;
      $(".hl-vo-mn-list li").each(function () {
        var thzprc = $(this).find(".hl-il-prz").text().trim();
        var thzcnt = $(this).find(".hl-il-count-num").text().trim();
        var thzamt = thzprc * thzcnt;
        totalamt = totalamt + thzamt;
      });
      this.lstCustInfo = JSON.parse(localStorage.getItem("lstCompanyInfo"));
      this.GST = this.lstCustInfo[0].tax;
      this.GSTAmount = (totalamt) / 100 * this.GST.toFixed(2);
      var topay = Math.round(totalamt + this.GSTAmount)

      $(".hl-vo-gst-per").text(this.GST);
      $(".hl-vo-itl-prz").text(totalamt);
      $(".h-vo-order-prz").text(topay);
      $(".hl-vo-tpay-prz").text(topay);
      $(".hl-vo-gst-prz").text(this.GSTAmount.toFixed(2));
    }, 10);
  }
  icount(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var curC = parseInt($(target).parent().find(".hl-il-count-num").text());
    var Chcount;
    if ($(target).hasClass("increase")) {
      Chcount = curC + 1;
    } else if ($(target).hasClass("decrease")) {
      Chcount = 0;
      if (curC != 0) {
        Chcount = curC - 1;
      }
      if (Chcount == 0) {
        $(target).closest("li").remove();
      }
    }
    $(target).parent().find(".hl-il-count-num").text(Chcount);
    this.priceCalc();
    event.stopPropagation();
  }

  priceCalc() {
    var totalamt = 0;
    $(".hl-vo-mn-list li").each(function () {
      var thzprc = $(this).find(".hl-il-prz").text().trim();
      var thzcnt = $(this).find(".hl-il-count-num").text().trim();
      var thzamt = thzprc * thzcnt;
      totalamt = totalamt + thzamt;
    });
    this.lstCustInfo = JSON.parse(localStorage.getItem("lstCompanyInfo"));
    this.GST = this.lstCustInfo[0].tax;
    this.GSTAmount = totalamt / 100 * this.GST;
    // this.GSTAmount = (totalamt) / 100 * this.GST.toFixed(2);
    var topay = Math.round(totalamt + this.GSTAmount)

    $(".hl-vo-gst-per").text(this.GST);
    $(".hl-vo-itl-prz").text(totalamt);
    $(".h-vo-order-prz").text(topay);
    $(".hl-vo-tpay-prz").text(topay);
    $(".hl-vo-gst-prz").text(this.GSTAmount.toFixed(2));
  }
  orderpop() {
    $(".h-vo-pop").addClass("h-open");
  }
  orderpopclk() {
    $(".h-vo-pop").removeClass("h-open");
    this.dataServ.orderDetails.orderId = "77";
    this.dataServ.orderDetails.phoneNumber = "9876543211";
    this.dataServ.orderDetails.address = "18,East Street,ch-65";

    var selectedI = [];
    var payment;
    if ($("#onlinepayment").prop("checked") == true) {
      payment = "ONLINE"
    } else {
      payment = "COD"
    }
    $(".hl-vo-mn-list li").each(function () {
      var thzname = $(this).find("h4").text().trim();
      var thzid = $(this).attr("foodid");
      var thzcnt = $(this).find(".hl-il-count-num").text().trim();
      this.lstCustInfo = JSON.parse(localStorage.getItem("lstCompanyInfo"));
      if (this.lstCustInfo[0].serialNo == undefined || this.lstCustInfo[0].serialNo == NaN || this.lstCustInfo[0].serialNo == "") {
        this.TableNo = 0;
      }
      if (localStorage.getItem("lstItemProductList") == null) {
        JSON.parse(localStorage.getItem("lstCompanyInfo"))[0].companyID
        var Cid = JSON.parse(localStorage.getItem("lstCompanyInfo"))[0].companyID
      }
      else {
        JSON.parse(localStorage.getItem("lstItemProductList"))[0].companyID
        var Cid = JSON.parse(localStorage.getItem("lstItemProductList"))[0].companyID
      }



      var thzData = {
        CompanyID: Cid,
        CustomerId: this.lstCustInfo[0].customerId,
        CustomerName: this.lstCustInfo[0].name,
        DOB: this.lstCustInfo[0].dob,
        Address: this.lstCustInfo[0].address,
        PhoneNumber: Number(this.lstCustInfo[0].phoneNumber),
        TableNo: this.TableNo,
        PaymentType: payment,
        FoodName: thzname,
        FoodProductId: Number(thzid),
        TotalAmount: Number($(".hl-vo-tpay-prz").text().trim()),
        Comments: $(".hl-vo-comments").find("textarea").val().trim(),
        Quantity: parseInt(thzcnt)
      }
      selectedI.push(thzData);
    });
    console.log("selectedI");
    console.log(JSON.stringify(selectedI));
    localStorage.setItem("selectedItems", "");
    localStorage.setItem("OrderDetails", JSON.stringify(selectedI));
    if (payment == "ONLINE") {
      this.appservice.PlaceOrderSave(selectedI).subscribe(
        data => {
          this.lstPlaceOrder = data as any;
          let options: any = {
            "name": this.lstPlaceOrder[0].companyName,
            "description": this.lstPlaceOrder[0].description,
            "image": "assets/images/logo.png",// this.lstPlaceOrder[0].logo,
            "order_id": this.lstPlaceOrder[0].razorOrderDetailsId,
            "handler": function (response) {
              if (response.razorpay_payment_id != "" && response.razorpay_payment_id != undefined && response.razorpay_payment_id != null) {
                this.router.navigate([{ outlets: { auth: ['orderplaced'] } }]);
              }
              else {
                this.Successmsg = "Details not saved. Please contact Administrator."
              }
              console.log(response);
            },
            "notes": {
              "address": "note value"
            },
            "theme": {
              "color": "#4c5123"
            }
          };

          var rzp1 = new Razorpay(options);
          rzp1.open();
        },
        error => {

          //  this.router.navigate([{ outlets: { main: ['orderplaced'] } }]);
        });
    }
    else if (payment == "COD") {
      console.log(selectedI);
      this.appservice.PlaceOrderSave(selectedI).subscribe(
        data => {

          this.lstPlaceOrder = data as any;
          this.dataServ.orderDetails.orderId = data[0].companyName + '_' + data[0].razorOrderDetailsId;
          this.dataServ.orderDetails.phoneNumber = data[0].phoneNumber;
          this.dataServ.orderDetails.address = data[0].address;
          // if (data. != "" && response.razorpay_payment_id != undefined && response.razorpay_payment_id != null) {
          this.router.navigate([{ outlets: { auth: ['orderplaced'] } }]);
          //}
        },
        error => {

          //  this.router.navigate([{ outlets: { main: ['orderplaced'] } }]);
        });
    }
  }
  removeI(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(target).closest("li").remove();
    this.priceCalc();
  }


  sItems = JSON.parse(localStorage.getItem("selectedItems"));
  orderedList = this.sItems;



}
