import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { DataService } from './data.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{
  title = 'hotel';
  header:boolean = false;
  constructor(location: Location, router: Router,private dataService: DataService) {
    router.events.subscribe(val => {
      if(location.path() !== ''){
        let link = location.path().split(":");
        link[0] === '/(auth'?this.header = false: this.header = true;
      }else{
        this.header = false;
      }
    });
    
  }

  ngOnInit() {
    $(document).on("click", ".h-head-search a", function(){
      $(".h-head-search").toggleClass("active");
      $(".h-head-search input").focus();
    });

    $(document).on("keyup", ".h-head-search input", function(){
        var valThis = $(this).val().toLowerCase();
        $(".hl-il-li-mn").removeClass("h-noitems");
        $(".hl-il-each").each(function () {
          var text = $(this).find("h4").text().toLowerCase();
          (text.indexOf(valThis) >= 0) ? $(this).removeClass("i-hide") : $(this).addClass("i-hide");
        });
        $(".hl-il-li-each").each(function() {
          var chlen = $(this).find(".hl-il-each").length;
          var hdlen = $(this).find(".hl-il-each.i-hide").length;
          if(chlen == hdlen) {
            $(this).addClass("i-hide");
          }
          else {
            $(this).removeClass("i-hide");
          }
        });
        var tchlen = $(".hl-il-each").length;
        var thdlen = $(".hl-il-each.i-hide").length;
        if(tchlen == thdlen){
          $(".hl-il-li-each").each(function () {
            var text = $(this).find("h3").text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).removeClass("i-hide") : $(this).addClass("i-hide");
            $(".hl-il-li-each").each(function () {
              if(!($(this).hasClass("i-hide"))){
                $(this).find(".hl-il-each").removeClass("i-hide");
              }
            });
          });
        }
        var fchlen = $(".hl-il-each").length;
        var fhdlen = $(".hl-il-each.i-hide").length;
        if(fchlen == fhdlen){
          $(".hl-il-li-mn").addClass("h-noitems");
        }
    });
  }

  itemList = {
    CategoryList:[]
  }
  sideMenuTog(sidenav: any){
    sidenav.open();
    this.itemList = this.dataService.catagoryList;
  }
   navClick(event){
    var target = event.target || event.srcElement || event.currentTarget;
    var idx = $(target).closest("mat-list-item").attr("data-index");
    var element = $(".hl-il-li-each")[idx];
    $(".h-il-main").animate({
        scrollTop: element.offsetTop - 100
    }, 1000);
   }

}



