import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RestAppService } from '../app.services';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { DataserviceService } from '../dataservice.service';
import { DataService } from '../data.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  constructor(private dataSer: DataService, public dataService: DataserviceService, private appservice: RestAppService, private router: Router) { }
  lstUserVerification: any;
  ngOnInit() {
    localStorage.clear();
    $(document).on('click', function () {
      var erlen = $(".hl-error").length;
      if (erlen > 0) {
        $(".h-input").removeClass("hl-error");
        $(".h-er-msg").remove();
      }
    });

  }

  genotp(event, ultabnum, ulname, ulphnum, uladd, uldob) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(".h-input.mandatory").each(function () {
      var thzval = $(this).find("input").val().trim();
      var thzplc = $(this).find("input").attr("placeholder");
      if (thzval == "") {
        var ermsg = `<p class="h-er-msg">Enter the ${thzplc}</p>`;
        $(this).append(ermsg);
        $(this).addClass("hl-error");
      }
    });
    var erlen = $(".hl-error").length;
    if (erlen == 0) {
      this.dataSer.userPhonenumber = ulphnum.value;
      localStorage.setItem("PhoneNumber", ulphnum.value);
      let obj = {
        CompanyID: 1,
        SerialNo: ultabnum.value,
        Name: ulname.value,
        PhoneNumber: ulphnum.value,
        Address: uladd.value,
        DOB: uldob.value
      }
      this.appservice.add(obj).subscribe(
        data => {
          this.lstUserVerification = data as any;
          if (this.lstUserVerification.length > 0) {
            
            //this.datas(this.lstUserVerification);
            this.dataService.serviceData = this.lstUserVerification;
            localStorage.setItem("lstCompanyInfo", this.lstUserVerification);
            this.router.navigate([{ outlets: { auth: ['userverfication'] } }]);
            // this.router.navigate([{ outlets: { auth: ['userverfication'] } }], { state: { data: this.lstUserVerification } });

          }
          else {
            //error message
          }
        },
        error => {
          //  this.router.navigate([{ outlets: { auth: ['error'] } }]);
        });
      console.log(ulname.value, ulphnum.value);
      this.router.navigate([{ outlets: { auth: ['userverfication'] } }]);
    }
    event.stopPropagation();
  }
  set datas(value: any) {
    this.dataService.serviceData = value;
  }
  datepic(e, uldob) {
    if (uldob.value != "") {
      $(uldob).parent().addClass("dateupdated");
    }
  }
  public date: Date;
  clearDate(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    this.date = null;
    $(target).closest(".dateupdated").removeClass("dateupdated");
  }


  maxDate = new Date();
}
