import { Component, OnInit } from '@angular/core';
import { RestAppService } from '../app.services';
import { DataserviceService } from '../dataservice.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.scss']
})
export class BillingDetailsComponent implements OnInit {

  constructor(private appservice: RestAppService, public dataService: DataserviceService, private router: Router) { }
  billingDetails = {
    orderList: []
  }
  backendJson: []
  logincheck = true;
  ngOnInit() {
   
   let lst = JSON.parse(localStorage.getItem("lstProducts"));
    let obj = {
      CompanyID: lst[0].companyID,
      Flag: 2
    }
    if (this.logincheck != true) {
      this.router.navigate(['/adminlogin']);
    }
    this.appservice.GetOrderedDet(obj).subscribe(
      data => {
        this.backendJson = data as any;
        $('.h-search-inp').keyup(function () {
          var search = $(this).val();
          $('.h-bd-t-c-e').hide();
          var len = $('.h-bd-t-c-e .h-bd-t-e:contains("' + search + '")').length;
          if (len > 0) {
            $('.h-bd-t-c-e .h-bd-t-e:contains("' + search + '")').each(function () {
              $(this).closest('.h-bd-t-c-e').show();
            });
            $('.h-bd-t-c').removeClass("noitems");
          } else {
            $('.h-bd-t-c').addClass("noitems");
          }
          $.expr[":"].contains = $.expr.createPseudo(function (arg) {
            return function (elem) {
              return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
          });
        });
        var ordL = this.backendJson;
        var frontendjson = {
          OrderList: []
        }
        $(ordL).each(function (i, v) {
          var cid = v.customerId;
          var ccr = v.createdAt;
          var ordereach = {
            billingID: v.billingID,
            comments: v.comments,
            companyID: v.companyID,
            companyName: v.companyName,
            createdAt: v.createdAt,
            createdBy: v.createdBy,
            customerId: v.customerId,
            customerName: v.customerName,
            description: v.description,
            discount: v.discount,
            dob: v.dob,
            flag: v.flag,
            foodName: v.foodName,
            foodProductId: v.foodProductId,
            logo: v.logo,
            modifiedAt: v.modifiedAt,
            modifiedBy: v.modifiedBy,
            orderDetails: v.orderDetails,
            orderDetailsId: v.orderDetailsId,
            paymentStatus: v.paymentStatus,
            paymentType: v.paymentType,
            phoneNumber: v.phoneNumber,
            placeOrderId: v.placeOrderId,
            quantity: v.quantity,
            razorOrderDetailsId: v.razorOrderDetailsId,
            razorPaymentId: v.razorPaymentId,
            status: v.status,
            tableNo: v.tableNo,
            tax: v.tax,
            totalAmount: v.totalAmount,
            unitPrice: v.unitPrice,
            Orderdetails: []
          }
          if (frontendjson.OrderList.length) {
            var x = 0;
            $(frontendjson.OrderList).each(function (ind, vl) {
              var fcid = vl.customerId;
              var fcr = vl.createdAt;
              if ((fcid == cid) && (fcr == ccr)) {
                x = 1;
              }
            });
            if (x == 0) {
              frontendjson.OrderList.push(ordereach);
            }
          } else {
            frontendjson.OrderList.push(ordereach);
          }
        });
        $(ordL).each(function (i, v) {
          var cid = v.customerId;
          var ccr = v.createdAt;
          var ordereach = {
            foodName: v.foodName,
            quantity: v.quantity
          }
          $(frontendjson.OrderList).each(function (ind, vl) {
            var fcid = vl.customerId;
            var fcr = vl.createdAt;
            if ((fcid == cid) && (fcr == ccr)) {
              vl.Orderdetails.push(ordereach);
            }
          });
        });
        this.billingDetails.orderList = frontendjson.OrderList;
        console.log(frontendjson);
        console.log(this.billingDetails.orderList);
      },
      error => {
        alert('error');
      });
  }
  datepic(searchDate) {
    if (searchDate.value != "") {
      $('.h-bd-t-c-e').hide();
      $(searchDate).parent().addClass("dateupdated");
      $(".h-bd-t-c-e").each(function () {
        var thisdate = $(this).attr("date");
        if (thisdate == searchDate.value) {
          $(this).show();
        }
      });
      if ($(".h-bd-t-c-e:visible").length) {
        $('.h-bd-t-c').removeClass("noitems");
      } else {
        $('.h-bd-t-c').addClass("noitems");
      }
    }
  }
  public date: Date;
  clearDate(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    this.date = null;
    $(target).closest(".dateupdated").removeClass("dateupdated");
    $(".h-bd-t-c-e").show();
    $('.h-bd-t-c').removeClass("noitems");
  }
}
