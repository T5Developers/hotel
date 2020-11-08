import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import { RestAppService } from '../app.services';
import { DataService } from '../data.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.scss']
})
export class UserVerificationComponent implements OnInit {
  obj: any;
  @Output() vr: EventEmitter<boolean> = new EventEmitter();
  OTP: number;
  details: string;
  phno: string;
  companyID: number;
  customerId: number;
  constructor(private dataService: DataserviceService, private dataServi: DataService, private appservice: RestAppService, private router: Router,
  ) { }
  logincheck = true

  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate(['/userlogin']);
    }
    this.phno = this.dataServi.userPhonenumber;
    //    this.dataService.serviceData[0].phoneNumber;
    document.getElementsByClassName("h-vef-num")[0].innerHTML = this.phno;
    $(document).on('click', function () {
      var erlen = $(".hl-error").length;
      if (erlen > 0) {
        $(".h-input").removeClass("hl-error");
        $(".h-er-msg").remove();
      }
    });
  }
  get data(): any {
    return this.dataService.serviceData;
  }

  uverf(event, uvotp) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(".h-input.mandatory").each(function () {
      var thzval = $(this).find("input").val().trim();
      if (thzval == "") {
        var ermsg = `<p class="h-er-msg">Enter the OTP</p>`;
        $(this).append(ermsg);
        $(this).addClass("hl-error");
      }
    });
    var erlen = $(".hl-error").length;
    if (erlen == 0) {
      this.obj = this.dataService.serviceData;
      this.details = this.obj[0].details;
      this.companyID = this.obj[0].companyID;
      this.customerId = this.obj[0].customerId;
      let objReq = {
        OTP: parseInt(uvotp.value),
        Details: this.details,
        CompanyID: this.companyID,
        CustomerId: this.customerId
      }
      this.appservice.VerifyOTP(objReq).subscribe(
        data => {
          this.dataService.serviceData = this.obj;
          if (data == "Success")
            this.router.navigate(['/itemlist']);
        }
        ,
        error => {
          if (error.error.text == "Success")
            this.router.navigate(['/itemlist']);
          else
            alert('Enter Valid OTP');
        });

    }
    event.stopPropagation();
  }
}
