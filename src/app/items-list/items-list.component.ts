import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import * as jQuery from 'jquery';
import * as currentItem from 'jquery';
import { DataserviceService } from '../dataservice.service';
import { DataService } from '../data.service';
import { RestAppService } from '../app.services';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  obj: any;
  IsUserExists: any;
  lstProducts: any;

  constructor(private _sanitizer: DomSanitizer, private appservice: RestAppService, public dataServic: DataService, public dataService: DataserviceService, private router: Router) { }
  itemList = {
    CategoryList: []
  };
  backendJson = []

  logincheck = true;
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate(['/userlogin']);
    }


    if (this.dataService.serviceData != undefined) {
      this.obj = this.dataService.serviceData;
      localStorage.setItem("lstCompanyInfo", this.obj);
    }
    else if (this.dataService.serviceData == undefined) {
      if (localStorage.getItem("lstCompanyInfo") == '[object Object]') {
        this.router.navigate(['/userlogin']);
      }
      else {
        this.obj = JSON.parse(localStorage.getItem("lstCompanyInfo"));
      }
    }

    this.appservice.getAllProducts(this.obj).subscribe(
      data => {
        this.lstProducts = data as any;
        this.backendJson = this.lstProducts[1];

        //localStorage.setItem("lstItemProductList", JSON.stringify(this.backendJson));
        localStorage.setItem("lstCompanyInfo", JSON.stringify(this.lstProducts[0]));

        var catl = this.backendJson;
        var frontendjson = {
          CategoryList: []
        }
        $(catl).each(function (i, v) {
          var catName = v.categoryName;
          var fd = v.foodProductId;
          var img = v.imageSource;
          if (frontendjson.CategoryList.length) {
            var x = 0;
            $(frontendjson.CategoryList).each(function (ind, vl) {
              var cname = vl.categoryName;
              if (catName == cname) {
                x = 1;
              }
            });
            if (x == 0) {
              var cateach = {
                categoryName: catName,
                items: []
              }
              frontendjson.CategoryList.push(cateach);
            }
          } else {
            var cateach = {
              categoryName: catName,
              items: []
            }
            frontendjson.CategoryList.push(cateach);
          }
        });
        $(catl).each(function (ind, vl) {
          var fd = vl.foodProductId;
          var catename = vl.categoryName;
          var fn = vl.foodName;
          var fp = vl.price;
          var fdes = vl.description;
          $(frontendjson.CategoryList).each(function (indx, vlu) {
            var y = 0;
            var ctname = vlu.categoryName;
            $(vlu.items).each(function (id, v) {
              var fodid = v.foodProductId;
              if (fodid == fd) {
                y = 1;
              }
            });
            if (y == 0) {
              var itemE = {
                foodProductId: fd,
                foodName: fn,
                price: fp,
                description: fdes,
                image: []
              }
              if (catename == ctname) {
                vlu.items.push(itemE);
              }
            }
          });
        });
        $(catl).each(function (index, val) {
          var foodid = val.foodProductId;
          var imagesr = val.imageSource;
          var type = val.type;
          $(frontendjson.CategoryList).each(function (idx, vle) {
            $(vle.items).each(function (i, ve) {
              var fdid = ve.foodProductId;
              if (foodid == fdid) {
                var imageSource = {
                  imageSource: imagesr,
                  type: type
                }
                ve.image.push(imageSource);
              }
            });
          });
        });

        this.dataServic.catagoryList = frontendjson;
        this.itemList = frontendjson;
        localStorage.setItem("foodItemList", JSON.stringify(frontendjson));
        console.log(frontendjson.CategoryList);
        var Cid = this.obj[0].companyID;
        this.appservice.GetBanner(Cid).subscribe(
          data => {
            // if (data > 0) {
            //alert('successfully updated');
            this.bannerImage.imageList = data as any;
            // }
          },
          error => {
            // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
            alert('Banner not fetched');
          });

      }, error => {
        alert('No Items found');
        this.router.navigate(['/userlogin']);
      });
    $(document).on("click", ".h-i-cr-acts", function () {
      var chlen = $(".h-i-carousel").find(".h-i-cr-c").find(".h-i-c-each").length;
      var actind = $(".h-i-c-each.active").index();
      var actindinc = $(".h-i-c-each.active").index() + 1;
      var actinddec = $(".h-i-c-each.active").index() - 1;
      $(".h-i-c-each").removeClass("active");
      if ($(this).hasClass("h-left")) {
        $(".h-i-c-each").eq(actinddec).addClass("active");
        if (actinddec == 0) {
          $(".h-left").addClass("h-disable");
        }
        $(".h-right").removeClass("h-disable");
      } else {
        $(".h-i-c-each").eq(actind + 1).addClass("active");
        if (actindinc + 1 == chlen) {
          $(".h-right").addClass("h-disable");
        }
        $(".h-left").removeClass("h-disable");
      }
    });

    // this.obj = JSON.parse(localStorage.getItem("lstItemProductList"));
    // var Cid;
    // if (this.obj != null) {
    //   Cid = this.obj[0].companyID;
    // }
    // else {

    //   Cid = JSON.parse(localStorage.getItem("lstCompanyInfo"))[0].companyID;
    // }

    // console.log(Cid);
    // this.appservice.GetBanner(Cid).subscribe(
    //   data => {
    //     // if (data > 0) {
    //     //alert('successfully updated');
    //     this.bannerImage.imageList = data as any;
    //     // }
    //   },
    //   error => {
    //     // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
    //     alert('Banner not fetched');
    //   });
    $(document).on("click", ".h-head-search a", function () {
      $(".h-head-search").toggleClass("active");
      $(".h-head-search input").focus();
    });

    $(document).on("keyup", ".h-head-search input", function () {
      var valThis = $(this).val().toLowerCase();
      $(".hl-il-li-mn").removeClass("h-noitems");
      $(".hl-il-each").each(function () {
        var text = $(this).find("h4").text().toLowerCase();
        (text.indexOf(valThis) >= 0) ? $(this).removeClass("i-hide") : $(this).addClass("i-hide");
      });
      $(".hl-il-li-each").each(function () {
        var chlen = $(this).find(".hl-il-each").length;
        var hdlen = $(this).find(".hl-il-each.i-hide").length;
        if (chlen == hdlen) {
          $(this).addClass("i-hide");
        }
        else {
          $(this).removeClass("i-hide");
        }
      });
      var tchlen = $(".hl-il-each").length;
      var thdlen = $(".hl-il-each.i-hide").length;
      if (tchlen == thdlen) {
        $(".hl-il-li-each").each(function () {
          var text = $(this).find("h3").text().toLowerCase();
          (text.indexOf(valThis) >= 0) ? $(this).removeClass("i-hide") : $(this).addClass("i-hide");
          $(".hl-il-li-each").each(function () {
            if (!($(this).hasClass("i-hide"))) {
              $(this).find(".hl-il-each").removeClass("i-hide");
            }
          });
        });
      }
      var fchlen = $(".hl-il-each").length;
      var fhdlen = $(".hl-il-each.i-hide").length;
      if (fchlen == fhdlen) {
        $(".hl-il-li-mn").addClass("h-noitems");
      }
    });
  }
  banners() {
    var currentItem = 1;
    (function ($, window, document, undefined) {
      var pluginName = "AnimatedSlider", defaults = { infiniteScroll: true, visibleItems: 3, changedCallback: null, willChangeCallback: null, userChangedCallback: null, useTransitions: true }; var supportsTransitions = _supportsTransitions(); function Plugin(element, options) {
        this.element = element; this.jqElem = $(element); this.items = $(this.element).children("li"); this.numSliderItems = this.items.length; this.currentItem = 1; this.commandQueue = []; this.jqElem.data(pluginName, this); this.options = $.extend({},
          defaults, options); this._defaults = defaults; this._name = pluginName; this.inTransition = false; this.init()
      } Plugin.prototype.init = function () {
        var pluginThis = this; if (pluginThis.options.useTransitions) this.jqElem.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
          if (pluginThis.inTransition) {
            pluginThis.inTransition = false; if (pluginThis.options.changedCallback) pluginThis.options.changedCallback(pluginThis, pluginThis.currentItem); setTimeout(function () { pluginThis.doCommandQueue() },
              50)
          }
        }); else { this.items.css("transition", "none"); this.items.find("*").css("transition", "none") } if (this.options.prevButton) $(this.options.prevButton).on("click", function (e) { e.preventDefault(); pluginThis.prevItem() }); if (this.options.nextButton) $(this.options.nextButton).on("click", function (e) { e.preventDefault(); pluginThis.nextItem() }); this.setItem(1); this.inTransition = false
      }; Plugin.prototype.setItem = function (n) {
        var sliderItems = this.items; sliderItems.removeClass(); var wrapFuncNone = function (n) { return n };
        var wrapFunc; if (this.options.infiniteScroll) wrapFunc = this._wrapIndex; else wrapFunc = wrapFuncNone; for (var i = 0; i < sliderItems.length; i++) { var item = sliderItems.eq(i); if (i == n) item.addClass("current_item"); else if (i < n) item.addClass("previous_hidden"); else if (i > n) item.addClass("next_hidden") } if (this.options.infiniteScroll) {
          sliderItems.eq(this._wrapIndex(n - 1)).removeClass().addClass("previous_item"); sliderItems.eq(this._wrapIndex(n + 1)).removeClass().addClass("next_item"); if (this.options.visibleItems == 3) {
            sliderItems.eq(this._wrapIndex(n -
              2)).removeClass().addClass("previous_hidden"); sliderItems.eq(this._wrapIndex(n + 2)).removeClass().addClass("next_hidden")
          } else if (this.options.visibleItems == 5) { sliderItems.eq(this._wrapIndex(n - 2)).removeClass().addClass("previous_item_2"); sliderItems.eq(this._wrapIndex(n + 2)).removeClass().addClass("next_item_2"); sliderItems.eq(this._wrapIndex(n - 3)).removeClass().addClass("previous_hidden"); sliderItems.eq(this._wrapIndex(n + 3)).removeClass().addClass("next_hidden") }
        } else {
          if (n - 1 >= 0) sliderItems.eq(n - 1).removeClass().addClass("previous_item");
          if (n + 1 < this.numSliderItems) sliderItems.eq(n + 1).removeClass().addClass("next_item"); if (this.options.visibleItems == 5) { if (n - 2 >= 0) sliderItems.eq(n - 1).removeClass().addClass("previous_item_2"); if (n + 2 < this.numSliderItems) sliderItems.eq(n + 1).removeClass().addClass("next_item_2") }
        } currentItem = n; if (supportsTransitions && this.options.useTransitions) { this.inTransition = true; if (this.options.willChangeCallback) this.options.willChangeCallback(this, this.currentItem) } else {
          if (this.options.willChangeCallback) this.options.willChangeCallback(this,
            this.currentItem); if (this.options.changedCallback) this.options.changedCallback(this, this.currentItem)
        }
      }; Plugin.prototype.nextItem = function () { if (this.inTransition) { if (this.commandQueue.length < 3) this.commandQueue.push("nextItem"); return } if (this.options.infiniteScroll || this.currentItem < this.numSliderItems - 1) { this.currentItem += 1; this.currentItem = this._wrapIndex(this.currentItem); this.setItem(this.currentItem); if (this.options.userChangedCallback) this.options.userChangedCallback(this, this.currentItem) } };
      Plugin.prototype.prevItem = function () { if (this.inTransition) { if (this.commandQueue.length < 3) this.commandQueue.push("prevItem"); return } if (this.options.infiniteScroll || this.currentItem >= 1) { this.currentItem -= 1; this.currentItem = this._wrapIndex(this.currentItem); this.setItem(this.currentItem); if (this.options.userChangedCallback) this.options.userChangedCallback(this, this.currentItem) } }; Plugin.prototype.clearAnimations = function () { this.inTransition = false; this.commandQueue = [] }; Plugin.prototype.doCommandQueue =
        function () { if (this.commandQueue.length == 0) return; var cmd = this.commandQueue.splice(0, 1)[0]; this[cmd]() }; Plugin.prototype.refresh = function () { this.items = $(this.element).children("li"); this.numSliderItems = this.items.length; this.setItem(this.currentItem); }; Plugin.prototype._wrapIndex = function (n) { if (n < 0) n += this.numSliderItems; if (n >= this.numSliderItems) n -= this.numSliderItems; return n }; $.fn[pluginName] = function (options) {
          return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) $.data(this,
              "plugin_" + pluginName, new Plugin(this, options))
          })
        }; function _supportsTransitions() { var b = document.body || document.documentElement; var s = b.style; var p = "transition"; if (typeof s[p] == "string") return true; p = p.charAt(0).toUpperCase() + p.substr(1); }
    })(jQuery, window, document);
    $("#h-slider").AnimatedSlider({
      prevButton: "#hl-b-prev",
      nextButton: "#hl-b-next",
      visibleItems: 3,
      infiniteScroll: true
    });
  }

  bannerImage = {
    CompanyID: 1,
    imageList: [

    ]
  }

  bannerImgClassList = ["current_item", "next_item", "next_hidden", "next_hidden", "previous_hidden", "previous_item"];
  slides = [];
  itempop(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var clkind = $(target).closest("li").attr("data-index");
    var prind = $(target).closest(".hl-il-li-each").attr("data-index");
    var pt = this.itemList.CategoryList[prind].items[clkind];
    var desc = pt.description;
    var prc = pt.price;
    var fname = pt.foodName;
    $(".h-i-cr-c").html("");
    $(".h-i-cr-acts").addClass("h-disable");
    var imglen = pt.image.length;
    if (imglen > 1) {
      $(".h-right").removeClass("h-disable");
    }
    $(pt.image).each(function (i, v) {
      var typ = v.type;
      if (typ == 'video') {
        var sourc = 'data:video/mp4;base64,' + v.imageSource;
      }
      else if (typ == 'image') {
        var sourc = 'data:image/jpeg;base64,' + v.imageSource;
      }

      var crHtml;
      if (typ == "image") {
        crHtml = `<div class="h-i-c-each" style="background-image:url(${sourc});"></div>`;
      } else if (typ == "video") {
        crHtml = `<div class="h-i-c-each">
                        <video autoplay loop>
                          <source src="${sourc}" type="video/mp4">
                        </video>
                      </div>`;
      }
      $(".h-i-cr-c").append(crHtml);
      $(".h-i-cr-c").find(".h-i-c-each").eq(0).addClass("active");
    });
    $(".h-i-desc").text(desc);
    $(".h-i-prc").text(prc);
    $(".h-i-name").text(fname);
    $(".h-i-pop").addClass("h-open");
  }
  pophide() {
    $(".h-i-pop").removeClass("h-open");
  }
  icount(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var curC = parseInt($(target).parent().find(".hl-il-count-num").text());
    var Chcount;
    if ($(target).hasClass("increase")) {
      Chcount = curC + 1;
    } else if ($(target).hasClass("decrease")) {
      Chcount = 0;
      if (curC != 0) {
        Chcount = curC - 1;
      }
    }
    if (Chcount == 0) {
      $(target).closest("li").removeClass("iselected");
    } else {
      $(target).closest("li").addClass("iselected");
    }
    $(target).parent().find(".hl-il-count-num").text(Chcount);
    var ilen = $(".iselected").length;
    $(".hl-i-cnt").text(ilen);
    event.stopPropagation();
  }
  vieworder() {
    // this.obj = JSON.parse(localStorage.getItem("lstItemProductList"));
    //var Cid = this.obj[0].companyID;
    this.obj = JSON.parse(localStorage.getItem("lstCompanyInfo"));
    var Cid = this.obj[0].companyID;
    var selectedI = {

      CompanyID: Cid,
      Phonenumber: "",
      ItemsList: []
    }
    if ($(".iselected").length) {
      $(".iselected").each(function () {
        var thzname = $(this).find("h4").text().trim();
        var thzid = $(this).attr("foodid");
        var thzprc = $(this).find(".hl-il-priz-amt").text().trim();
        var thzcnt = $(this).find(".hl-il-count-num").text().trim();
        var thzdec = $(this).find("p").text().trim();
        var thzData = {
          CompanyID: Cid,
          FoodName: thzname,
          FoodId: Number(thzid),
          Price: thzprc,
          Count: thzcnt,
          Description: thzdec,
        }
        selectedI.ItemsList.push(thzData);
      });
      localStorage.setItem("selectedItems", JSON.stringify(selectedI));
      console.log(JSON.stringify(selectedI));
      this.router.navigate(['/vieworder']);
    } else {
      alert("Your Cart is empty, Please add item(s) to place order");
    }
  }

  navClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idx = $(target).closest("mat-list-item").attr("data-index");
    var element = $(".hl-il-li-each")[idx];
    $(".h-il-main").animate({
      scrollTop: element.offsetTop - 100
    }, 1000);
  }

}
