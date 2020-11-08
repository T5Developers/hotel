import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from './data.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'hotel';

  constructor(location: Location, router: Router, private dataService: DataService) {


  }

  ngOnInit() {
    var url = window.location.href;
    let spliturl = url.split("?");
    if (spliturl.length == 2) {
      let cname = spliturl[1].split("=");
      let obj = {
        Apiurl: spliturl[0],
        CompanyName: cname[1]
      }
      console.log(obj);
      window.location.href = spliturl[0];
    }

  }



}



