import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import * as $ from 'jquery';
import { RestAppService } from '../app.services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  IsUserExists: any;
  constructor(private dataService: DataService, private appservice: RestAppService, private router: Router) { }

  ngOnInit() {
    localStorage.clear();
    $(document).on('click', function () {
      var erlen = $(".hl-error").length;
      if (erlen > 0) {
        $(".h-input").removeClass("hl-error");
        $(".h-er-msg").remove();
      }
    });
    $(document).on("click", ".h-lg-fp", function () {
      $(".h-dialog-fpassword").addClass("h-open");
    });
    $(document).on("click", ".h-d-ov,.h-dialog-close", function () {
      $(".h-dialog").removeClass("h-open");
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
        Password: pword.value
      }
      this.appservice.IsSAexists(obj).subscribe(
        data => {
          if (data == 0) {
            alert('Enter the valid Credentials');
          }
          else {
            this.IsUserExists = data as any;
            localStorage.setItem("lstAdminIn", this.IsUserExists);
            this.router.navigate(['/superadmin']);
          }
        },
        error => {
          alert('Please enter valid Credentails');
        });

    }
    event.stopPropagation();
  }
  savePassword(newpassword, confirmpassword) {
    console.log(newpassword.value, confirmpassword.value);
  }
}
