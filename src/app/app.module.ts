import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule, MatIconModule, MatButtonModule,
  MatSidenavModule, MatCheckboxModule,
  MatSelectModule, MatListModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, DateAdapter, MatBadgeModule, MatSlideToggleModule
} from '@angular/material';
import { ItemsListComponent } from './items-list/items-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UploadBannerComponent } from './upload-banner/upload-banner.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { ViewOrderComponent } from './view-order/view-order.component';
import { OrderplacedComponent } from './orderplaced/orderplaced.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { HttpClientModule } from '@angular/common/http';
import { RestAppService } from './app.services';
import { FormsModule } from '@angular/forms';
import { DateFormat } from './date-format';
const routes: Routes = [
  {
    path: "",
    component: UserLoginComponent

  },
  {
    path: "superadmin",
    component: SuperadminComponent

  },
  {
    path: "userlogin",
    component: UserLoginComponent

  },
  {
    path: "adminlogin",
    component: AdminLoginComponent

  },
  {
    path: "superadminlogin",
    component: LoginComponent

  },
  {
    path: "userverfication",
    component: UserVerificationComponent

  }, {
    path: "signup",
    component: SignupComponent

  }, {
    path: "itemlist",
    component: ItemsListComponent

  }, {
    path: "admindashboard",
    component: AdminDashboardComponent

  }, {
    path: "uploadbanner",
    component: UploadBannerComponent

  }, {
    path: "billingdetails",
    component: BillingDetailsComponent

  }, {
    path: "orderdetails",
    component: OrderDetailsComponent

  }, {
    path: "editcategory",
    component: EditMenuComponent

  },
  {
    path: "vieworder",
    component: ViewOrderComponent

  },
  {
    path: "orderplaced",
    component: OrderplacedComponent

  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    UserLoginComponent,
    UserVerificationComponent,
    ItemsListComponent,
    AdminDashboardComponent,
    UploadBannerComponent,
    EditMenuComponent,
    BillingDetailsComponent,
    OrderDetailsComponent,
    AdminLoginComponent,
    ViewOrderComponent,
    OrderplacedComponent,
    SuperadminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule, FormsModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatSlideToggleModule,
    MatCheckboxModule, MatSelectModule, MatListModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatBadgeModule, MatCarouselModule.forRoot()
  ],
  providers: [
    { provide: DateAdapter, useClass: DateFormat },
    RestAppService],


  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}
