import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestAppService } from '../app.services';
import { DataserviceService } from '../dataservice.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  IsUserExists: any;
  constructor(public dataService: DataserviceService, private appservice: RestAppService, private router: Router) { }

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
  loginck(event, uname, pword) {
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
      console.log(uname.value, pword.value);
      let obj = {
        UserName: uname.value,
        Password: pword.value,
      }
      this.appservice.IsUserExists(obj).subscribe(
        data => {

          this.IsUserExists = data as any;
          if (this.IsUserExists.length > 0) {
            this.dataService.adminData = this.IsUserExists;
            this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
          }
          else {
            //error message
          }
        },
        error => {
          this.router.navigate([{ outlets: { auth: ['adminlogin'] } }]);
          alert('Please enter valid Credentails');
        });
      
    }
    event.stopPropagation();
  }
}
