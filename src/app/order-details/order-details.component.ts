import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestAppService } from '../app.services';
import { DataserviceService } from '../dataservice.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;

  ExportTOExcel() {

  }
  constructor(private appservice: RestAppService, public dataService: DataserviceService, private router: Router) { }
  //orderDetails: any;
  backendJson = []

  GSTAmount = 0;
  orderDetails = {
    Totalorders: "0",
    Totalqtysales: "0",
    Totalrevenue: "0",
    orderList: []
  }
  Totalrevenue = 0;
  logincheck = true;
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate([{ outlets: { auth: ['adminlogin'] } }]);
    }
    let lst = JSON.parse(localStorage.getItem("lstProducts"));
    let obj = {
      CompanyID: lst[0].companyID,
      Flag: 1
    }
    this.appservice.GetOrderedDet(obj).subscribe(
      data => {
        this.backendJson = data[0] as any;
        this.orderDetails.Totalorders = data[1].totalOrders;
        this.orderDetails.Totalqtysales = data[1].totalQtySales;
        this.orderDetails.Totalrevenue = data[1].totalRevenue;
        // this.backendJson = this.orderDetails;
        $('.h-search-inp').keyup(function () {
          var search = $(this).val();
          $('.h-od-t-c-e').hide();
          var len = $('.h-od-t-c-e .h-od-t-e:contains("' + search + '")').length;
          if (len > 0) {
            $('.h-od-t-c-e .h-od-t-e:contains("' + search + '")').each(function () {
              $(this).closest('.h-od-t-c-e').show();
            });
            $('.h-od-t-c').removeClass("noitems");
          } else {
            $('.h-od-t-c').addClass("noitems");
          }
          $.expr[":"].contains = $.expr.createPseudo(function (arg) {
            return function (elem) {
              return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
          });
        });
        $(document).on("click", ".h-status-ico i", function (e) {
          $(this).closest(".h-od-t-c-e").addClass("h-status-edit-act");
          var thisoffset = $(this)[0].getBoundingClientRect();
          var top = thisoffset.top + 30;
          var left = thisoffset.left - 130;
          $(".h-status-pop").css({ "display": "block", "top": top + "px", "left": left + "px" });
          e.stopPropagation();
        });
        $(document).on("click", function () {
          $(".h-status-pop").hide();
          $(".h-od-t-c-e").removeClass("h-status-edit-act");
        });
        var ordL = this.backendJson;
        var frontendjson = {
          OrderList: []
        }
        var allAmount = [];
        $(ordL).each(function (i, v) {
          var cid = v.customerId;
          // this.GSTAmount = (v.unitPrice) / 100 * v.tax
          //this.Totalrevenue += Math.round(v.unitPrice + this.GSTAmount)
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
              allAmount.push(v.totalAmount);
            }
          } else {
            frontendjson.OrderList.push(ordereach);
            allAmount.push(v.totalAmount);
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
        this.orderDetails.orderList = frontendjson.OrderList;
        this.totalOrder = frontendjson.OrderList.length;

        console.log(frontendjson);
        console.log(this.orderDetails.orderList);
        var total = 0;
        $.each(allAmount, function () {
          total += this;
        });
        this.totalRevenue = total;
      },
      error => {
        alert('error');
      });
  }
  totalOrder;
  totalRevenue;


  pendingclk() {
    $(".h-od-main").removeClass("completed-active cancelled-active").addClass("pending-active");
  }
  completedclk() {
    $(".h-od-main").removeClass("pending-active cancelled-active").addClass("completed-active");
  }
  cancelledclk() {
    $(".h-od-main").removeClass("pending-active completed-active").addClass("cancelled-active");
  }
  allclk() {
    $(".h-od-main").removeClass("pending-active completed-active cancelled-active");
  }
  exportclk() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ScoreSheet.xlsx');
  }
  datepic(e, searchDate) {
    if (searchDate.value != "") {
      $('.h-od-t-c-e').hide();
      $(searchDate).parent().addClass("dateupdated");
      $(".h-od-t-c-e").each(function () {
        var thisdate = $(this).attr("date");
        if (thisdate == searchDate.value) {
          $(this).show();
        }
      });
      if ($(".h-od-t-c-e:visible").length) {
        $('.h-od-t-c').removeClass("noitems");
      } else {
        $('.h-od-t-c').addClass("noitems");
      }
    }
  }
  public date: Date;
  clearDate(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    this.date = null;
    $(target).closest(".dateupdated").removeClass("dateupdated");
    $(".h-od-t-c-e").show();
    $('.h-od-t-c').removeClass("noitems");
  }

  statuspopclk(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var ind;
    if ($(target).closest("li").hasClass("h-st-completed")) {
      $(".h-status-edit-act").removeClass("h-status-pending h-status-cancelled").addClass("h-status-completed");
      //$(".h-status-edit-act").find(".h-status-ico i").attr("class", "fa fa-check-circle-o");
      ind = $(".h-status-edit-act").attr("data-index");
      this.orderDetails.orderList[ind].status = "completed";
    } else if ($(target).closest("li").hasClass("h-st-cancelled")) {
      $(".h-status-edit-act").removeClass("h-status-pending h-status-completed").addClass("h-status-cancelled");
      //$(".h-status-edit-act").find(".h-status-ico i").attr("class", "fa fa-times");
      ind = $(".h-status-edit-act").attr("data-index");
      this.orderDetails.orderList[ind].status = "cancelled";
    }
    $(".h-od-t-c-e").removeClass("h-status-edit-act");
    console.log(this.orderDetails.orderList[ind]);
    let obj = {
      RazorOrderDetailsId: this.orderDetails.orderList[ind].razorOrderDetailsId,
      Status: this.orderDetails.orderList[ind].status,
      CompanyID: this.orderDetails.orderList[ind].companyID,
      Flag: 1
    }
    this.appservice.UpdatePOStatus(obj).subscribe(
      data => {

        alert('Order changed successfully');
      },
      error => {
        alert('Data not saved Successfully');
        //  this.router.navigate([{ outlets: { main: ['orderplaced'] } }]);
      });
  }
}
