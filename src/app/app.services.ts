import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, JsonpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Injectable()
export class RestAppService {
    private headers: HttpHeaders;
    private accessPointUrl: string = environment.API_URL// 'api/RestaurantAPI';

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    }

    public get() {
        // Get all jogging data
        return this.http.get(this.accessPointUrl + "api/values", { headers: this.headers });
    }
    public GetOrderedDet(obj) {
        // Get all jogging data
        return this.http.post(this.accessPointUrl + "GetOrderedDetails", JSON.stringify(obj), { headers: this.headers });
    }
    public getAllProducts(obj) {
        // Get all jogging data
        return this.http.post(this.accessPointUrl + "GetAllProducts", JSON.stringify(obj), { headers: this.headers });
    }
    public getAllProductsAdmin(CompId) {
        return this.http.get(this.accessPointUrl + "GetAllProductsAdmin?CompId=" + CompId + "", { headers: this.headers });
    }
    public getHistoryPayments(companyID) {
        return this.http.get(this.accessPointUrl + "GetHistoryPayment?CompanyId=" + companyID + "", { headers: this.headers });
    }

    public GetBanner(CompId) {
        return this.http.get(this.accessPointUrl + "GetBanner?CompanyId=" + CompId + "", { headers: this.headers });
    }
    // https://localhost:44332/api/values/GetAllProductsAdmin?CompId=1

    public add(userlogin) {
        return this.http.post(this.accessPointUrl + "InsertCust", JSON.stringify(userlogin), { headers: this.headers });
    }

    public SuperAdminInsert(obj) {
        return this.http.post(this.accessPointUrl + "SuperAdminInsert", JSON.stringify(obj), { headers: this.headers });
    }
    public CartSave(obj) {
        return this.http.post(this.accessPointUrl + "InsertCustCart", JSON.stringify(obj), { headers: this.headers });
    }
    public PlaceOrderSave(obj) {
        return this.http.post(this.accessPointUrl + "PlaceOrder", JSON.stringify(obj), { headers: this.headers });
    }
    public AdminReg(obj) {
        return this.http.post(this.accessPointUrl + "AdminReg", JSON.stringify(obj), { headers: this.headers });
    }
    public UpdatePaymntHis(obj) {
        return this.http.post(this.accessPointUrl + "UpdatePaymntHis", JSON.stringify(obj), { headers: this.headers });
    }
    public UpdatePOStatus(obj) {
        return this.http.post(this.accessPointUrl + "UpdateOrderDetails", JSON.stringify(obj), { headers: this.headers });
    }
    public IsUserExists(obj) {
        return this.http.post(this.accessPointUrl + "IsUserExists", JSON.stringify(obj), { headers: this.headers });
    }
    public IsSAexists(obj) {
        return this.http.post(this.accessPointUrl + "IsSAUserExists", JSON.stringify(obj), { headers: this.headers });
    }
    public cart(obj) {
        return this.http.post(this.accessPointUrl + "SaveOrder", JSON.stringify(obj), { headers: this.headers });
    }
    public taxUpdate(obj) {
        return this.http.post(this.accessPointUrl + "UpdateTax", JSON.stringify(obj), { headers: this.headers });
    }

    public SubPause(obj) {
        let PauseStatus;
        if (obj.pause) {
            PauseStatus = "Active";
        }
        else {
            PauseStatus = "InActive";
        }
        let item = {
            CompanyID: obj.companyID,
            Status: PauseStatus
        }
        return this.http.post(this.accessPointUrl + "SubscriptionPause", JSON.stringify(item), { headers: this.headers });
    }
    public renewalsub(obj) {
        return this.http.post(this.accessPointUrl + "Renew", JSON.stringify(obj), { headers: this.headers });
    }
    public editCategory(obj) {
        var lst = obj.CategoryList;
        return this.http.post(this.accessPointUrl + "InsertFoodProducts", lst, { headers: this.headers });
    }
    public BannerUpload(obj) {
        var lst = obj.ImageSource;
        return this.http.post(this.accessPointUrl + "UploadBanner", lst, { headers: this.headers });
    }
    // addHero(hero: Hero): Observable<Hero> {
    //     return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
    //         catchError(this.handleError('addHero', hero))
    //       );
    //   }
    public remove(payload) {
        return this.http.delete(this.accessPointUrl + '/' + payload.id, { headers: this.headers });
    }

    public update(payload) {
        return this.http.put(this.accessPointUrl + '/' + payload.id, payload, { headers: this.headers });
    }
    public GetSuperAdminInfo(AdminName) {
        // https://localhost:44332/api/values/GetSubSA?SAName=%27Admin%27
        return this.http.get(this.accessPointUrl + "GetSubSA?SAName'" + AdminName + "'", { headers: this.headers });
    }
    public VerifyOTP(obj) {
        return this.http.post(this.accessPointUrl + "OTPVerification", JSON.stringify(obj), { headers: this.headers });
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }
}