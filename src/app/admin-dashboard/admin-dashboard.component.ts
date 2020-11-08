import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { parse } from 'querystring';
import { RestAppService } from '../app.services';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  CompanyId: number;
  objDB: any;
  StartDate: Date;
  EndDate: Date;
  DaysRemaining: number;
  deaysleft: number;
  CompanyID: number
  o: any;
  GST: number;
  CostPerDay: number;
  constructor(public dataService: DataserviceService, private appservice: RestAppService, private router: Router) { }

  logincheck = true;
  startDatef
  endDatef
  minDate
  daysleft
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate(['/adminlogin']);
    }
    if (this.dataService.adminData != null || this.dataService.adminData != undefined) {
      this.objDB = this.dataService.adminData;
      this.StartDate = this.objDB[0].startDate;
      localStorage.setItem("StartDate", this.StartDate.toString());
      this.EndDate = this.objDB[0].endDate;
      localStorage.setItem("EndDate", this.EndDate.toString());
      this.deaysleft = this.objDB[0].totalDays;
      this.GST = this.objDB[0].tax
      this.CostPerDay = this.objDB[0].price;
      var StartDat = this.objDB[0].startDate;
      var startD = this.convertDate(StartDat);
      var stsp = startD.split("/");
      var syr = stsp[2];
      var sdy = parseInt(stsp[1]);
      var smn = stsp[0];
      var startDatefa = sdy + "/" + smn + "/" + syr;
      this.startDatef = startDatefa
      var EndDat = this.objDB[0].endDate;
      var endD = this.convertDate(EndDat);
      //endD = "10/10/2020";
      var edsp = endD.split("/");
      var eyr = edsp[2];
      var edy = parseInt(edsp[1]);
      var edyinc = parseInt(edsp[1]) + 1;
      var emn = edsp[0];
      debugger
      var sptendDate = eyr + "," + emn + "," + edy;
      var endDatefa = edy + "/" + emn + "/" + eyr;
      this.endDatef = endDatefa
      var endDatel = emn + "/" + edy + "/" + eyr;
      this.minDate = new Date(sptendDate);
      //var inc = nedate.setDate(nedate.getDate() + 1)
      this.minDate.setDate(this.minDate.getDate() + 1);
      var today = new Date();
      var eddate = new Date(endDatel);
      var Difference_In_Time = eddate.getTime() - today.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.daysleft = Math.ceil(Difference_In_Days);

      if (this.objDB == undefined) {
        this.objDB = JSON.parse(localStorage.getItem("lstProducts"));
      }
      localStorage.setItem("lstProducts", JSON.stringify(this.dataService.adminData));

    }
    else {

      if (this.objDB == undefined) {
        this.objDB = JSON.parse(localStorage.getItem("lstProducts"));
        if (this.objDB == null) {
          this.router.navigate([{ outlets: { auth: ['adminlogin'] } }]);
        }
      }
      this.StartDate = this.objDB[0].startDate;
      localStorage.setItem("StartDate", this.StartDate.toString());
      this.EndDate = this.objDB[0].endDate;
      localStorage.setItem("EndDate", this.EndDate.toString());
      this.deaysleft = this.objDB[0].totalDays;
      this.GST = this.objDB[0].tax
      this.CostPerDay = this.objDB[0].price;
      var StartDat = this.objDB[0].startDate;
      var startD = this.convertDate(StartDat);
      var stsp = startD.split("/");
      var syr = stsp[2];
      var sdy = parseInt(stsp[1]);
      var smn = stsp[0];
      var startDatefa = sdy + "/" + smn + "/" + syr;
      this.startDatef = startDatefa
      var EndDat = this.objDB[0].endDate;
      var endD = this.convertDate(EndDat);
      //endD = "10/10/2020";
      var edsp = endD.split("/");
      var eyr = edsp[2];
      var edy = parseInt(edsp[1]);
      var edyinc = parseInt(edsp[1]) + 1;
      var emn = edsp[0];
      var sptendDate = eyr + "," + emn + "," + edy;
      var endDatefa = edy + "/" + emn + "/" + eyr;
      this.endDatef = endDatefa
      var endDatel = emn + "/" + edy + "/" + eyr;
      this.minDate = new Date(sptendDate);
      //var inc = nedate.setDate(nedate.getDate() + 1)
      this.minDate.setDate(this.minDate.getDate() + 1);
      var today = new Date();
      var eddate = new Date(endDatel);
      var Difference_In_Time = eddate.getTime() - today.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      this.daysleft = Math.ceil(Difference_In_Days);
    }

    $(document).on("click", ".h-diag-clk", function () {
      var diaAt = $(this).attr("dialog");
      $("." + diaAt).addClass("h-open");
    });
    $(document).on("click", ".h-d-ov,.h-dialog-close", function () {
      $(".h-dialog").removeClass("h-open");
    });
    $(".h-d-logo input").change(function (e) {
      if (this.files && this.files[0]) {
        $(this).closest(".h-d-logo").addClass("imgadded active");
        const fileReader: FileReader = new FileReader();
        fileReader.onload = function (event: Event) {
          $(".imgadded.active").find("img").attr('src', fileReader.result);
          $(".h-d-logo").removeClass("active");
        }

        fileReader.readAsDataURL(this.files[0]);
      }
    });
    $(document).on("click", ".h-img-clear", function () {
      $(this).closest(".h-d-logo").removeClass("imgadded");
      $(this).closest(".h-d-logo").find("input").val("");
      $(this).closest(".h-d-logo").find("img").attr("src", "");
    });
  }


  startDate() {
    var stDate = $(".h-d-rw-s-d").val();
    var edDate = $(".h-d-rw-e-d").val();
    if (edDate != "") {
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
      if (Difference_In_Days < 30) {
        alert("Select minimum 30 days");
        var diffDate = 30 - Difference_In_Days;
        sdate.setDate(sdate.getDate() - diffDate);
        var dd = sdate.getDate();
        var mm = sdate.getMonth() + 1;
        var y = sdate.getFullYear();
        var fixedeDate = dd + '/' + mm + '/' + y;
        $(".h-d-rw-s-d").val(fixedeDate);
      } else {
        var price = 100;
        var gst = 18;
        var dayP = Difference_In_Days * price;
        var dayG = Math.ceil(dayP / gst);
        var dayT = dayP + dayG;
        $(".h-d-rw-t-d").text(Difference_In_Days);
        $(".h-d-rw-d-p").text(dayP);
        $(".h-d-rw-g-p").text(Math.ceil(dayG));
        $(".h-d-rw-t-p").text(dayT);
      }
    }
  }
  endDate() {
    var stDate = $(".h-d-rw-s-d").val();
    var edDate = $(".h-d-rw-e-d").val();
    if (stDate == "") {
      alert("Please Enter the Start Date");
      $(".h-d-rw-e-d").val("");
    } else {
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

      if (Difference_In_Days < 30) {
        var diffDate = 30 - Difference_In_Days;
        edate.setDate(edate.getDate() + diffDate);
        var dd = edate.getDate();
        var mm = edate.getMonth() + 1;
        var y = edate.getFullYear();
        var fixedeDate = dd + '/' + mm + '/' + y;
        $(".h-d-rw-e-d").val(fixedeDate);
        alert("Select minimum 30 days");
        var price = this.CostPerDay;
        var gst = this.GST;
        var dayP = 30 * price;
        var dayG = Math.ceil(dayP / gst);
        var dayT = dayP + dayG;
        $(".h-d-rw-t-d").text("30");
        $(".h-d-rw-d-p").text(dayP);
        $(".h-d-rw-g-p").text(dayG);
        $(".h-d-rw-t-p").text(dayT);
      } else {
        var price = this.CostPerDay;
        var gst = this.GST;
        var dayP = Difference_In_Days * price;
        var dayG = Math.ceil(dayP / gst);
        var dayT = dayP + dayG;
        $(".h-d-rw-t-d").text(Difference_In_Days);
        $(".h-d-rw-d-p").text(dayP);
        $(".h-d-rw-g-p").text(dayG);
        $(".h-d-rw-t-p").text(dayT);
      }
    }
  }
  paynow(rwsdate, rwedate, rwnumofdays, rwprice, rwgst, rwtotal) {
    let obj = {
      CompanyID: JSON.parse(localStorage.getItem("lstProducts"))[0].companyID,
      Sdate: rwsdate.value,
      Edate: rwedate.value,
      TotalDays: parseInt(rwnumofdays.innerText),
      Price: parseInt(rwprice.innerText),
      Tax: parseInt(rwgst.innerText),
      TotalAmount: parseInt(rwtotal.innerText)
    }
    console.log(obj);
    this.appservice.renewalsub(obj).subscribe(
      data => {
        if (data > 0) {
          alert('renewal successfully');
        }

      },
      error => {
        // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
        alert('renewal ');
      });
    rwsdate.value = "";
    rwedate.value = "";
    $(".h-d-rw-t-d").text("");
    $(".h-d-rw-d-p").text("");
    $(".h-d-rw-g-p").text("");
    $(".h-d-rw-t-p").text("");
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join('/')
  }
  copyurl(customerurl) {
    console.log(customerurl.innerText)
  }
  taxconfirm(taxper) {

    let obj = {
      CompanyId: this.objDB[0].companyID,
      Tax: parseInt(taxper.value)

    }
    this.appservice.taxUpdate(obj).subscribe(
      data => {
        if (data > 0) {
          alert('successfully updated');
        }

      },
      error => {
        // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
        alert('error');
      });

  }


  // console.log(convertDate('Mon Nov 19 13:29:40 2012')) // => "19/11/2012"

}


