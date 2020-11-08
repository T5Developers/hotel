import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAppService } from '../app.services';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  IsUserExists: any;
  constructor(private appservice: RestAppService, private router: Router) { }

  ngOnInit() {
    $(document).on('click', function () {
      var erlen = $(".hl-error").length;
      if (erlen > 0) {
        $(".h-input").removeClass("hl-error");
        $(".h-er-msg").remove();
      }
    });
  }
  signupck(event, sname, spnum, suname, spwrd, scpwrd) {
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
      let obj = {
        Name: sname.value,
        PhoneNumber: spnum.value,
        UserName: suname.value,
        Password: spwrd.value,
        ConfirmPassword: scpwrd.value
      }
      this.appservice.SuperAdminInsert(obj).subscribe(
        data => {
          this.IsUserExists = data as any;
          if (data > 0) {
            this.router.navigate(['/superadminlogin']);
          }
          else {
            alert('User already Exists');
          }
        },
        error => {
          if (error)
            alert('Please contact administrator');
        });

    }
    else {
    }
    event.stopPropagation();
  }
}
