import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { RestAppService } from '../app.services';
@Component({
  selector: 'app-upload-banner',
  templateUrl: './upload-banner.component.html',
  styleUrls: ['./upload-banner.component.scss']
})
export class UploadBannerComponent implements OnInit {

  constructor(private appservice: RestAppService, private router: Router) { }
  logincheck = true;
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate([{ outlets: { auth: ['adminlogin'] } }]);
    }

    var CompId = 0;
    if (localStorage.getItem("lstProducts") != null) {
      CompId = JSON.parse(localStorage.getItem("lstProducts"))[0].companyID
    }
    this.appservice.GetBanner(CompId).subscribe(
      data => {
        // if (data > 0) {
        //alert('successfully updated');
        this.bannerImages.imageList = data as any;
        this.bannerimgfetch();
        // }
      },
      error => {
        // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
        alert('Banner not fetched');
      });
    $(".h-ub-each input").change(function (e) {
      if (this.files && this.files[0]) {
        $(this).closest(".h-ub-each").addClass("imgadded active");
        const fileReader: FileReader = new FileReader();
        fileReader.onload = function (event: Event) {
          $(".imgadded.active").find("img").attr('src', fileReader.result);
          $(".h-ub-each").removeClass("active");
        }
        fileReader.readAsDataURL(this.files[0]);
      }
    });


    $(document).on("click", ".h-img-clear", function () {
      $(this).closest(".h-ub-each").removeClass("imgadded");
      $(this).closest(".h-ub-each").find("input").val("");
      $(this).closest(".h-ub-each").find("img").attr("src", "");
    });

  }
  savebanner() {
    var imgList = {

      ImageSource: []
    }
    $(".imgadded").each(function () {
      var thzsrc = $(this).find("img").attr("src");
      var base64removedsrc = thzsrc.split(',')[1];
      var Cid = 0;
      if (localStorage.getItem("lstProducts") != null) {
        Cid = JSON.parse(localStorage.getItem("lstProducts"))[0].companyID
      }
      var thzData = {
        CompanyID: Cid,
        imageSource: base64removedsrc
      }
      imgList.ImageSource.push(thzData);
    });

    this.appservice.BannerUpload(imgList).subscribe(
      data => {
        // if (data > 0) {
        alert('successfully updated');
        // }
      },
      error => {
        // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
        alert('Banner not uploaded');
      });
    console.log(JSON.stringify(imgList));
  }
  bannerImages = {
    CompanyID: 0,
    imageList: [
      // {
      //   imageSource:"assets/images/banner-1.jpg"
      // },
      // {
      //   imageSource:"assets/images/banner-2.jpg"
      // },
      // {
      //   imageSource:"assets/images/banner-3.jpg"
      // },
      // {
      //   imageSource:"assets/images/banner-4.jpg"
      // }
    ]
  }

  bannerimgfetch() {
    var i;
    for (i = 0; i < this.bannerImages.imageList.length; i++) {
      var img = document.getElementsByClassName("h-ub-each")[i];
      var imgL = this.bannerImages.imageList[i].imageSource;
      $(img).addClass("imgadded");
      $(img).find("img").attr("src", "data:image/jpeg;base64," + imgL);
    }
  }
}
