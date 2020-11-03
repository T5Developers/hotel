import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DataserviceService } from '../dataservice.service';
import { RestAppService } from '../app.services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {

  lstProduct: any;
  CompId: number;
  constructor(public dataService: DataserviceService, private appservice: RestAppService, private router: Router) { }
  menuItems = {
    CategoryList: []
  };

  backendJson = [];
  logincheck = true;
  ngOnInit() {
    if (this.logincheck != true) {
      this.router.navigate([{ outlets: { auth: ['adminlogin'] } }]);
    }
    if (this.lstProduct == undefined)
      this.lstProduct = JSON.parse(localStorage.getItem("lstProducts"));
    else
      localStorage.setItem("lstProducts", JSON.stringify(this.lstProduct))
    this.CompId = this.lstProduct[0].companyID;
    localStorage.setItem("CompanyID", (this.CompId).toString())
    this.appservice.getAllProductsAdmin(this.CompId).subscribe(
      data => {
        this.backendJson = data as any;

        // $(lst).each(function (it, val) {
        //   var CompanyID = val.companyID
        //   var FoodProductId = val.FoodProductId
        //   var FoodCategoryId = val.foodCategoryId
        //   var CategoryName = val.categoryName
        //   var FoodName = val.foodName
        //   var ImageSource = val.imageSource
        //   var Price = val.price
        //   var Description = val.description

        //   //  this.backendJson.push(CompanyID);
        // })
        var catl = this.backendJson;
        var frontendjson = {
          CategoryList: []
        }
        $(catl).each(function (i, v) {
          var catName = v.categoryName;
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
          var typ = val.type;
          $(frontendjson.CategoryList).each(function (idx, vle) {
            $(vle.items).each(function (i, ve) {
              var fdid = ve.foodProductId;
              if (foodid == fdid) {
                var imageSource = {
                  imageSource: imagesr,
                  type: typ
                }
                ve.image.push(imageSource);
              }
            });
          });
        });
        $(frontendjson.CategoryList).each(function (ix, va) {
          $(va.items).each(function (i, v) {
            var im = v.image;
            var imlen = im.length;
            var imremn = 4 - imlen;
            if (imremn != 0) {
              var imgemp = {
                imageSource: "",
                type: "none"
              }
              var i;
              for (i = 0; i < imremn; i++) {
                v.image.push(imgemp);
              }
            }
          });
        });
        console.log(frontendjson);

        this.menuItems = frontendjson;
      },
      error => {
        // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
        alert('No Items Found');
      });
    $(document).on("change", ".h-ui-each input", function () {
      $(this).closest(".h-ui-each").addClass("h-uploadact");
      getBase64(this.files[0]);
      function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          if (file.type.split('/')[0] == 'image') {
            $(".h-uploadact").removeClass("vidadded").addClass("imgadded active");
            $(".h-uploadact").find("img").attr('src', reader.result);
            $(".h-ui-each").removeClass("active h-uploadact");
          } else if (file.type.split('/')[0] == 'video') {
            $(".h-uploadact").removeClass("imgadded").addClass("vidadded");
            $(".h-uploadact").find("source").attr('datavid', reader.result);
            $(".h-uploadact").find("source").attr("src", URL.createObjectURL(file));
            $(".h-uploadact").find("source").parent()[0].load();
            $(".h-ui-each").removeClass("active h-uploadact");
          }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
    });

    $(document).on("click", ".h-em-items-add", function (e) {
      $(".mandatory").each(function () {
        var thzval = $(this).find("input").val().trim();
        if (thzval == "") {
          $(this).addClass("hl-error");
        }
      });
      var erlen = $(".hl-error").length;
      if (erlen == 0) {
        $(this).closest(".h-em-clist-each").addClass("h-tog-act");
        $(this).closest(".h-em-clist-each").find(".h-em-cl-c").slideDown();
        var fid = Math.random().toString(36).slice(-5);
        var listHtml = `<div class="h-em-t-c-e h-append-act" foodid="${fid}">
                      <div class="h-em-t-e h-cell-5f h-item-nam mandatory"><input type="text" placeholder="Enter the Name"/></div>
                    <div class="h-em-t-e h-cell-5f h-item-des mandatory"><input type="text" placeholder="Enter the Description"/></div>
                    <div class="h-em-t-e h-cell-6f h-tc h-item-img">
                        <div class="h-ui-each">
                            <label class="h-ui-lb clearfix">
                                <input type="file" accept="image/png, image/jpg, image/jpeg,image/*,video/mp4,video/x-m4v,video/*">
                                <span class="h-ui-c">
                                  <i class="fa fa-plus"></i>
                                    <img src=""/><video><source src=""></video>
                                </span>
                            </label>
                            <span class="h-img-clear"><i class="fa fa-times-circle"></i></span>
                        </div>
                        <div class="h-ui-each">
                            <label class="h-ui-lb clearfix">
                                <input type="file" accept="image/png, image/jpg, image/jpeg,image/*,video/mp4,video/x-m4v,video/*">
                                <span class="h-ui-c">
                                <i class="fa fa-plus"></i>
                                    <img src=""/><video><source src=""></video>
                                </span>
                            </label>
                            <span class="h-img-clear"><i class="fa fa-times-circle"></i></span>
                        </div>
                        <div class="h-ui-each">
                            <label class="h-ui-lb clearfix">
                                <input type="file" accept="image/png, image/jpg, image/jpeg,image/*,video/mp4,video/x-m4v,video/*">
                                <span class="h-ui-c">
                                <i class="fa fa-plus"></i>
                                    <img src=""/><video><source src=""></video>
                                </span>
                            </label>
                            <span class="h-img-clear"><i class="fa fa-times-circle"></i></span>
                        </div>
                        <div class="h-ui-each">
                            <label class="h-ui-lb clearfix">
                                <input type="file" accept="image/png, image/jpg, image/jpeg,image/*,video/mp4,video/x-m4v,video/*">
                                <span class="h-ui-c">
                                <i class="fa fa-plus"></i>
                                    <img src=""/><video><source src=""></video>
                                </span>
                            </label>
                            <span class="h-img-clear"><i class="fa fa-times-circle"></i></span>
                        </div>
                    </div>
                    <div class="h-em-t-e h-cell-4f h-tc h-em-prz mandatory ">
                        <span>Rs</span> 
                        <input type="number" placeholder="Enter"/>
                        <span> /-</span>
                        </div>
                    <div class="h-em-t-e h-cell-4f h-em-t-actions h-tr">
                        <span class="h-em-itm-del"><i class="fa fa-trash"></i></span>
                    </div>
                </div>`;
        $(this).closest(".h-em-clist-each").find(".h-em-t-c").append(listHtml);
        $(".h-append-act").find(".h-item-nam input").focus();
        $(".h-em-t-c-e").removeClass("h-append-act");
      }
      e.stopPropagation();
    });

    $(document).on("click", ".h-em-cat-add", function (e) {
      var catHtml = `<div class="h-em-clist-each h-append-act">
                    <div class="h-em-cl-s">
                        <h5 class="mandatory"><input type="text" class="h-em-catnam" Placeholder="Enter Category Name"/></h5>
                        <div class="h-em-actions">
                            <div class="h-em-a-each h-em-items-add"><i class="fa fa-plus"></i></div>
                            <div class="h-em-a-each h-em-cat-item-delete"><i class="fa fa-trash"></i></div>
                            <div class="h-em-a-each">
                                <i class="fa fa-chevron-right h-em-li-tog"></i>
                            </div>
                        </div>
                    </div>
                    <div class="h-em-cl-c">
                        <div class="h-em-t-head">
                            <div class="h-em-t-e h-cell-5f">Name</div>
                            <div class="h-em-t-e h-cell-5f">Descrition</div>
                            <div class="h-em-t-e h-cell-6f h-tc">Image/Video</div>
                            <div class="h-em-t-e h-cell-4f h-tc">Pricing</div>
                            <div class="h-em-t-e h-cell-4f h-tr"></div>
                        </div>
                        <div class="h-em-t-c">
                        </div>
                    </div>
                </div>`;

      $(".mandatory").each(function () {
        var thzval = $(this).find("input").val().trim();
        if (thzval == "") {
          $(this).addClass("hl-error");
        }
      });
      var erlen = $(".hl-error").length;
      if (erlen == 0) {
        $(".h-em-c-list").append(catHtml);
        $(".h-append-act").find("h5 input").focus();
        $(".h-em-clist-each").removeClass("h-append-act");
        $(".h-em-c-list").removeClass("no-items");
      }
      e.stopPropagation();
    });

    $(document).on("click", ".h-em-itm-del", function () {
      $(this).closest(".h-em-t-c-e").remove();
    });
    $(document).on("click", ".h-em-cat-item-delete", function () {
      $(this).closest(".h-em-clist-each").remove();
      var catlen = $(".h-em-clist-each").length;
      if (catlen == 0) {
        $(".h-em-c-list").addClass("no-items");
      }
    });
    $(document).on("click", ".h-img-clear", function () {
      $(this).closest(".h-ui-each").removeClass("imgadded vidadded");
      $(this).closest(".h-ui-each").find("input").val("");
      $(this).closest(".h-ui-each").find("img").attr("src", "");
      $(this).closest(".h-ui-each").find("source").attr("src", "");
      $(this).closest(".h-ui-each").find("source").attr("datavid", "");
    });
    $(document).on('click', function () {
      var erlen = $(".hl-error").length;
      if (erlen > 0) {
        $(".hl-error").removeClass("hl-error");
      }
    });
  }
  catToggle(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    $(target).closest(".h-em-clist-each").toggleClass("h-tog-act");
    $(target).closest(".h-em-clist-each").find(".h-em-cl-c").slideToggle();
  }
  catsave(event) {
    var mItemsList = {
      CategoryList: []
    }
    $(".mandatory").each(function () {
      var thzval = $(this).find("input").val().trim();
      if (thzval == "") {
        $(this).addClass("hl-error");
      }
    });
    var erlen = $(".hl-error").length;
    if (erlen == 0) {
      var itmlen = $(".h-em-t-c-e").length;
      if (itmlen == 0) {
        alert("Please add Items");
      } else {
        var defaultimg = "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lBtMhpV4lLuibkALUfaXZ7h15nC0L8j0jVjVSxqh+x8TIezresChQxKxa3Pfl5GJZDCS2UMm/MiWqUvq54nMIe5DC1NTaWz5TWVSRKKzLGr+wPEFQCqylJV1MS7C8m3ZYoFWgSjV/DjyUyqGElpQ6fSMhE0YrXukdr3bLSNJMR/RHG8NqNkBL1NSXJ/gevEFQCqwSFVaQVTOAy8EHkO9k9jyx5OKNSzDeqsM+eUA1eijZgNNUpNsOxDAolGWhfgekasRWcxHmJWR1NSWx7x3gKgFV0gkKq0jMFdyIlqvt5cxIguJNOTXBjUwSu7GjGqm3n9jwFL1NGXKlrevpDIVVGYK7kRLVe3mFoX4HpGrGqlZ/SPtl/V88AoBVdIZCqoyBXcnSCCtIiNGz5falzH4tG7EW3n9jFW0WvNyjIOjqREHR0ZfjGpyTKFdyOlqvaKsKFgbCGEYEFkfLbUoDdiLbz+zjYN+B6xEPR1JQ0i9KOlqvbgJohK3sHYlhQwyFBZHyu1LmITsRbef2cQoAq4CI6BBiNU1Eog4G2jtNEXqcaXIln2IWjjh35MUmhZHym1LckL2ItvP7OIQBVcBDAquMqH3JmZKstH53WOBto7TRF6nGjyNZt5hbIGHfkxkSGR8nrWGpXg7Zpt4/fFCBVgIYsLjKh9yOFqvbj07F15MQDU+JmKu5xZfJhWogosIdjP08opBLav3KXAu8VryTJDMmAW138zVQi4Wq9vDaLzC/cWGTRgNVE2FZf09oUtRdVllK9H+8Tmq8psNTtoku3dLeZGPux6RSpMr4xhfAQC1elYEsTpSD0BvZYqlSrq/+EaysrKysrKysr/tVJSUlJSUlJSU/wCf3//aAAwDAQACAAMAAAAQ9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999998999999959999999999999999999/nI+9995GLtU99999999999999999SnQ+29rjP9+599999999999999996JCncd9OX99o5999999999999999qLbJN8t9/d99D+9999999999999999qyXasiGP8yfP9999999999999999999J86y2e6U/999999999999999999999sKU8Uv999999999999999999999997fHCt5Z999999999999999999999jH8p4X+R69999999999999999999sw7dctd07H99999999999999999999+cc999+d89999999999999999999999999999999999999999999999999x9x19x9x9999999999999999999tNhdBsMZlxld99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999//EACARAQACAgICAwEAAAAAAAAAAAEAESExEEBBYSBgcHH/2gAIAQMBAT8Q/cUVHADPxG1hnRXKmI7p6KKiNkhmyIoGfJEri3UA0RFbxUJDgegioj5IZsjqmGbI1yU8DkywvJoI8B0LNwzZHdMA2TSwMHgcFMpS2uai0z3RR+obZBVcCjZKA7hw6xrgcuEZizpiPE8mA8Kjv1GcsQG247phidjE2j1yI6xBjUFHEaTfz2c0jUBJVuajv1LFiPr5rGuCCIwPmamoAgj6g03GsDE/EGF364vIsZhznEMOqFGyEdr8MBE+fqVSpX61/8QAKhEBAAECAwcEAwEBAAAAAAAAAQARITFBYRBAUcHh8PFxkaGxIIHRcID/2gAIAQIBAT8Q/wBVCtjfKCqsGw09NZmo++sRGj+CVDbjlK+K+tiYe3t0i40V0t8RV5NxpIqypBokCpfJ5Pdo7P8AiefCIqOOxhy5wmV8jmyqiu0aBzo09/G4UEVY8o0SGnvk8nu0QBbMgVL5PJ7tMuq09GEgzs7BM6v1FQz2uTmylxzX287gmcHGDHvk8nu0ZHbM77Yae+Tye7RlWnEhEzXzBONfo67F7YNyaBq026h4enGVYYFjcbXusSH0vk8nu0RBppFVqwwlEmH8d1I8HYucHxwiPyOmw9QFeMcr10yhBS2b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"
        $(".h-em-t-c-e").each(function () {
          var imglen = $(this).find(".imgadded").length;
          if (imglen > 0) {
            $(this).find(".imgadded").each(function () {
              var thissrc = $(this).find("img").attr("src");
              var base64removedsrc = thissrc.split(',')[1];
              var thisfoodname = $(this).closest(".h-em-t-c-e").find(".h-item-nam input").val();
              var thisid = $(this).closest(".h-em-t-c-e").attr("foodid");
              var thisprc = $(this).closest(".h-em-t-c-e").find(".h-em-prz input").val();
              var thisdesc = $(this).closest(".h-em-t-c-e").find(".h-item-des input").val();
              var catnam = $(this).closest(".h-em-clist-each").find(".h-em-catnam").val();
              if (this.CompId == undefined || this.CompId == null) {
                this.CompId = localStorage.getItem("CompanyID");
              }
              var eachItemData = {
                CategoryName: catnam,
                FoodName: thisfoodname,
                // FoodProductId: thisid,
                Price: Number(thisprc),
                Description: thisdesc,
                ImageSource: base64removedsrc,
                CompanyID: Number(this.CompId),
                // CreatedAt: "",
                // createdBy: "",
                // foodCategoryId: "",
                // foodID: "",
                // isDiscountable: "",
                // modifiedAt: "",
                // modifiedBy: "",
                // taxPercent: "",
                type: "image"
              }
              mItemsList.CategoryList.push(eachItemData);
            });

          } else {
            var thisfoodname = $(this).find(".h-item-nam input").val();
            var thisid = $(this).attr("foodid");
            var thisprc = $(this).find(".h-em-prz input").val();
            var thisdesc = $(this).find(".h-item-des input").val();
            var catnam = $(this).closest(".h-em-clist-each").find(".h-em-catnam").val();
            if (this.CompId == undefined || this.CompId == null) {
              this.CompId = localStorage.getItem("CompanyID");
            }
            var eachItemData = {
              CategoryName: catnam,
              FoodName: thisfoodname,
              FoodProductId: thisid,
              Price: Number(thisprc),
              Description: thisdesc,
              imageSource: defaultimg,
              CompanyID: Number(this.CompId),
              // createdAt: "",
              // createdBy: "",
              // foodCategoryId: "",
              // foodID: "",
              // isDiscountable: "",
              // modifiedAt: "",
              // modifiedBy: "",
              // taxPercent: "",
              Type: "image"
            }
            mItemsList.CategoryList.push(eachItemData);
          }
          $(this).find(".vidadded").each(function () {
            var thissrc = $(this).find("source").attr("datavid");
            console.log(thissrc);
            var base64removedsrc = thissrc.split(',')[1];
            var thisfoodname = $(this).closest(".h-em-t-c-e").find(".h-item-nam input").val();
            var thisid = $(this).closest(".h-em-t-c-e").attr("foodid");
            var thisprc = $(this).closest(".h-em-t-c-e").find(".h-em-prz input").val();
            var thisdesc = $(this).closest(".h-em-t-c-e").find(".h-item-des input").val();
            var catnam = $(this).closest(".h-em-clist-each").find(".h-em-catnam").val();
            if (this.CompId == undefined || this.CompId == null) {
              this.CompId = localStorage.getItem("CompanyID");
            }
            var eachItemData = {
              CategoryName: catnam,
              FoodName: thisfoodname,
              // FoodProductId:Number(thisid),
              Price: Number(thisprc),
              Description: thisdesc,
              imageSource: base64removedsrc,
              CompanyID: Number(this.CompId),
              // createdAt: "",
              // createdBy: "",
              // foodCategoryId: "",
              // foodID: "",
              // isDiscountable: "",
              // modifiedAt: "",
              // modifiedBy: "",
              // taxPercent: "",
              Type: "video"
            }
            mItemsList.CategoryList.push(eachItemData);
          });
        });

        var catListJson = mItemsList;
        console.log(catListJson);
        this.appservice.editCategory(catListJson).subscribe(
          data => {
            mItemsList.CategoryList = data as any;
            alert('Saved successfully');
          },
          error => {
            // this.router.navigate([{ outlets: { auth: ['admindashboard'] } }]);
            alert('No Records Saved');
          });
      }
    }
    event.stopPropagation();
  }
  export() {
    alert("exported");
  }


}
