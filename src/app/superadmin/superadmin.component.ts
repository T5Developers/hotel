import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestAppService } from '../app.services';
import * as $ from 'jquery';
@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss']
})
export class SuperadminComponent implements OnInit {

  Adminname: string;
  lstAdminInfo: any;
  //adminsList: [];

  constructor(private appservice: RestAppService, private router: Router) { }
  adminsList: any;
  logincheck = true;
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate(['/superadminlogin']);
    }
    this.Adminname = "Admin";
    this.appservice.GetSuperAdminInfo(this.Adminname).subscribe(
      data => {
        debugger;
        this.adminsList = data[0] as any;
        // this.adminsList[0]

        $(document).on('click', function () {
          var erlen = $(".hl-error").length;
          if (erlen > 0) {
            $(".h-dg-inp").removeClass("hl-error");
            $(".h-er-msg").remove();
          }
        });
        $.each(this.adminsList, function (ind, val) {
          var strdate = val.startDate;
          var sdspt = strdate.split("T");
          var sdsptd = sdspt[0].split("-");
          var sdate = sdsptd[2] + "/" + sdsptd[1] + "/" + sdsptd[0];
          var sdatedif = sdsptd[1] + "/" + sdsptd[2] + "/" + sdsptd[0];
          val.StartDate = sdate;
          var endate = val.endDate;
          var edspt = endate.split("T");
          var edsptd = edspt[0].split("-");
          var edate = edsptd[2] + "/" + edsptd[1] + "/" + edsptd[0];
          var edatedif = edsptd[1] + "/" + edsptd[2] + "/" + edsptd[0];
          val.EndDate = edate;

          var today = new Date();
          var eddate = new Date(edatedif);
          var Difference_In_Time = eddate.getTime() - today.getTime();
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          var deaysleft = Math.ceil(Difference_In_Days);

          val.daysLeft = deaysleft;
          // if (val.drcr == 'debit') {
          //   val.status = 'completed'
          // }
          // else {
          //   val.status = 'pending'
          // }
        });
        console.log(this.adminsList);

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
      },
      error => {
        alert('Error while loading Data.!');
        //  this.router.navigate([{ outlets: { main: ['orderplaced'] } }]);
      });
  }

  hadmin: boolean = true;
  hsub: boolean = false;
  hpay: boolean = false;
  supad($event) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(".h-sa-l-c-e").removeClass("active");
    $(target).addClass("active");
    if ($(target).hasClass("h-ad")) {
      $(".h-od-ad").show();
      $(".h-od-sd").hide();
      $(".h-od-pq").hide();
    } else if ($(target).hasClass("h-sub")) {
      $(".h-od-ad").hide();
      $(".h-od-sd").show();
      $(".h-od-pq").hide();
    } else if ($(target).hasClass("h-pay")) {
      $(".h-od-ad").hide();
      $(".h-od-sd").hide();
      $(".h-od-pq").show();
    }
  }
  addCompany() {
    $(".h-dg-inp").find("input").val("");
    $(".pause").prop("checked", false);
    $(".h-dialog-addcomp").addClass("h-open");
  }
  popClose() {
    $(".h-dialog").removeClass("h-open");
    $(".h-od-t-c-e").removeClass("editedadmin");
    $(".h-sa-r").removeClass("editactive");
    $(".confact").removeClass("confact");
  }
  editAdmin(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(".h-sa-r").addClass("editactive");
    var ind = $(target).closest(".h-od-t-c-e").attr("data-index");
    var thisData = this.adminsList[ind];
    $(target).closest(".h-od-t-c-e").addClass("editedadmin");
    $(".cmname").val(thisData.companyName);
    $(".csname").val(thisData.adminName);
    $(".addrs").val(thisData.address);
    $(".phnum").val(thisData.phoneNumber);
    $(".uname").val(thisData.userName);
    $(".pword").val(thisData.password);
    $(".sdate").val(thisData.StartDate);
    console.log(thisData);
    $(".edate").val(thisData.EndDate);
    $(".cpday").val(thisData.price);
    $(".pymnt").val(thisData.paymentType);
    $(".amnt").val(thisData.totalAmount);
    $(".cmnts").val(thisData.comments);
    $(".drcr").val(thisData.drCr);
    $(".status").val(thisData.status);
    $(".h-dialog-addcomp").addClass("h-open");
  }
  deleteAdmin(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var ind = $(target).closest(".h-od-t-c-e").attr("data-index");
    var thisData = this.adminsList[ind];
    var companyID = this.adminsList[ind].companyID;
    this.adminsList = this.adminsList.filter(x => x.companyID !== companyID)
    console.log(this.adminsList);
    console.log(companyID);
  }
  pauseCheck(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var ind = $(target).closest(".h-od-t-c-e").attr("data-index");
    console.log(this.adminsList[ind]);
    this.appservice.SubPause(this.adminsList[ind]).subscribe(
      data => {
        if (data > 0) {
          alert('Pause Successfully updated');
          this.ngOnInit();
        }
      },
      error => {
        alert('Pause Unsuccessfull.!')
      });
  }

  paymentHistory = [];
  amountHistory($event, admList) {
    var target = event.target || event.srcElement || event.currentTarget;
    var companyID = admList.companyID;
    var CompanyName = admList.companyName;
    $(".h-ph-comp-name").text(CompanyName);
    $(".h-ph-comp-id").text(companyID);
    this.appservice.getHistoryPayments(Number(companyID)).subscribe(
      data => {
        this.paymentHistory = data as any;
      },
      error => {
        alert('There is no data for this company.');
      });

    $(".h-dialog-payment-history").addClass("h-open");
  }
  phdecr(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var ind = $(target).closest(".h-od-t-c-e").attr("data-index");
    var thisData = this.paymentHistory[ind];
    console.log(thisData);
  }
  phcheck(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var ind = $(target).closest(".h-od-t-c-e").attr("data-index");
    var thisData = this.paymentHistory[ind];
    console.log(thisData);
    var Status;
    Status = $('#ddlPaymentApprove').val();
    let obj = {
      PaymentStatus: Status,
      AdminSubscriptionHistoryId: thisData.adminSubscriptionHistoryId
    }
    this.appservice.UpdatePaymntHis(obj).subscribe(
      data => {

        alert('Saved successfully');
      },
      error => {
        alert('Data not saved Successfully');
        //  this.router.navigate([{ outlets: { main: ['orderplaced'] } }]);
      });
    $(target).toggleClass("h-th-clr");
  }
  saveAdmin(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(".mandatory").each(function () {
      var thzval = $(this).find("input").val().trim();
      var thzplc = $(this).find("input").attr("placeholder");
      if (thzval == "") {
        var ermsg = `<p class="h-er-msg">${thzplc}</p>`;
        $(this).append(ermsg);
        $(this).addClass("hl-error");
      }
    });
    var erlen = $(".hl-error").length;
    if (erlen == 0) {
      var cname = $(".cmname").val().trim();
      var csname = $(".csname").val().trim();
      var addrs = $(".addrs").val().trim();
      var phnum = $(".phnum").val().trim();
      var uname = $(".uname").val().trim();
      var pword = $(".pword").val().trim();
      var sdate = $(".sdate").val().trim();
      var sspt = sdate.split("/");
      var sdif = sspt[1] + "/" + sspt[0] + "/" + sspt[2];
      var edate = $(".edate").val().trim();
      var espt = edate.split("/");
      var edif = espt[1] + "/" + espt[0] + "/" + espt[2];
      var cpday = $(".cpday").val().trim();
      var pymnt = $(".pymnt").val();
      var amnt = $(".amnt").val().trim();
      var cmnts = $(".cmnts").val().trim();
      var drcr = $(".drcr").val();
      var status = $(".status").val();
      var pause = "";
      var pausecheck;
      if ($('.pause').is(':checked')) {
        pause = "checked";
        pausecheck = true;
      } else {
        pausecheck = false;
      }
      var today = new Date();
      var eddate = new Date(edif);
      var Difference_In_Time = eddate.getTime() - today.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      var daysleft = Math.ceil(Difference_In_Days);
      var compid;
      if ($(".h-sa-r").hasClass("editactive")) {
        compid = $(".editedadmin").attr("companyid");
      } else {
        compid = 0;
      }
      var edata = {
        CompanyID: Number(compid),
        CompanyName: cname,
        CustomerName: csname,
        Address: addrs,
        PhoneNumber: phnum,
        UserName: uname,
        Password: pword,
        SDate: sdate,
        EDate: edate,
        Price: Number(cpday),
        Payments: pymnt,
        TotalAmount: Number(amnt),
        Comments: cmnts,
        DrCr: drcr,
        Status: status,
        Pause: pausecheck,
        DaysLeft: daysleft
      }
      this.appservice.AdminReg(edata).subscribe(
        data => {
          //this.lstAdminInfo = data as any;
          console.log(data);
          alert('Saved successfully');
        },
        error => {
          alert('Data not saved Successfully');
          //  this.router.navigate([{ outlets: { main: ['orderplaced'] } }]);
        });


      $(".h-dialog-addcomp").removeClass("h-open");
      $(".h-dg-inp").find("input").val("");
      $(".pause").prop("checked", false);
      $(".h-od-t-c-e").removeClass("editedadmin");
      $(".h-sa-r").removeClass("editactive");
      console.log(edata);
    }
    event.stopPropagation();
  }


  saveCompany() {
    var admins = [];
    $(".h-od-ad").find(".h-od-t-c-e").each(function () {
      var thzdata = $(this).data("eachData");
      admins.push(thzdata);
    });
    console.log(admins);
  }

  pendingclk() {
    $(".h-sa-r").removeClass("completed-active").addClass("pending-active");
  }
  completedclk() {
    $(".h-sa-r").removeClass("pending-active").addClass("completed-active");
  }
  allclk() {
    $(".h-sa-r").removeClass("pending-active completed-active");
  }
  exportclk() {
    alert("Exported");
  }
  sminDate = new Date();
  minDate;
  startdatepic(startDate) {
    var stDate = $(".sdate").val();
    var edDate = $(".edate").val();
    var cpdy = $(".cpday").val();
    if ((stDate != "") && (edDate != "") && (cpdy != "")) {
      var stsp = stDate.split("/");
      var syr = stsp[2];
      var sdy = stsp[0];
      var smn = stsp[1];
      var stDatel = smn + "/" + sdy + "/" + syr;
      var sdate = new Date(stDatel);
      var edsp = edDate.split("/");
      var eyr = edsp[2];
      var edy = edsp[0];
      var emn = edsp[1];
      var endDatel = emn + "/" + edy + "/" + eyr;
      var edate = new Date(endDatel);
      var Difference_In_Time = edate.getTime() - sdate.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
      var amnt = cpdy * Difference_In_Days;
      $(".amnt").val(amnt);
    }
    if (stDate != "") {
      $(startDate).parent().addClass("dateupdated");
      var edsp = startDate.value.split("/");
      var eyr = edsp[2];
      var edy = parseInt(edsp[0]);
      var edyinc = parseInt(edsp[0]) + 1;
      var emn = edsp[1];
      var sptendDate = eyr + "," + emn + "," + edyinc;
      var nedate = new Date(sptendDate);
      this.minDate = nedate;
    }
  }

  enddatepic(endDate) {
    var stDate = $(".sdate").val();
    var edDate = $(".edate").val();
    var cpdy = $(".cpday").val();
    if (stDate == "") {
      alert("Please Enter the Start Date");
      $(".edate").val("");
    } else {
      if (endDate.value != "") {
        $(endDate).parent().addClass("dateupdated");
      }
      if ((stDate != "") && (edDate != "") && (cpdy != "")) {
        var stsp = stDate.split("/");
        var syr = stsp[2];
        var sdy = stsp[0];
        var smn = stsp[1];
        var stDatel = smn + "/" + sdy + "/" + syr;
        var sdate = new Date(stDatel);
        var edsp = edDate.split("/");
        var eyr = edsp[2];
        var edy = edsp[0];
        var emn = edsp[1];
        var endDatel = emn + "/" + edy + "/" + eyr;
        var edate = new Date(endDatel);
        var Difference_In_Time = edate.getTime() - sdate.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
        var amnt = cpdy * Difference_In_Days;
        $(".amnt").val(amnt);
      }
    }
  }
  public sdate: Date;
  public edate: Date;
  clearDate(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    if ($(target).closest(".dateupdated").find("input").hasClass("sdate")) {
      this.sdate = null;
    } else {
      this.edate = null;
    }
    $(target).closest(".dateupdated").removeClass("dateupdated");
  }
  cperday(event) {
    var stDate = $(".sdate").val();
    var edDate = $(".edate").val();
    var cpdy = $(".cpday").val();
    if ((stDate != "") && (edDate != "")) {
      var stsp = stDate.split("/");
      var syr = stsp[2];
      var sdy = stsp[0];
      var smn = stsp[1];
      var stDatel = smn + "/" + sdy + "/" + syr;
      var sdate = new Date(stDatel);
      var edsp = edDate.split("/");
      var eyr = edsp[2];
      var edy = edsp[0];
      var emn = edsp[1];
      var endDatel = emn + "/" + edy + "/" + eyr;
      var edate = new Date(endDatel);
      var Difference_In_Time = edate.getTime() - sdate.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
      var amnt = cpdy * Difference_In_Days;
      $(".amnt").val(amnt);
    }
  }
  menuToggle() {
    $(".h-sa-mn").toggleClass("h-sa-menu-act");
  }
}
