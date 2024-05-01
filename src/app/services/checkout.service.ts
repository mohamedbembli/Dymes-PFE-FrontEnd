import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  public host : string = this.authService.host;

  public addProduct(checkoutForm: any, totalPrices:any, totalWithTax:any, shippingFees:any, promotion:any, clientType:any, paymentType:any) {
    const formData = new FormData();
    const checkoutDataArray = [];

    for (const key in checkoutForm) {
      if (checkoutForm.hasOwnProperty(key)) {
        if (key != "Créer un compte")
        checkoutDataArray.push({ key: key, value: checkoutForm[key] });
      }
    }

    formData.append("checkoutDataArray",JSON.stringify(checkoutDataArray));
    formData.append("totalPrices",JSON.stringify(totalPrices));
    formData.append("totalWithTax",totalWithTax);
    formData.append("shippingFees",shippingFees);
    if (promotion != null){
      formData.append("promotion",JSON.stringify(promotion));
    }
    else{
      formData.append("promotion","null");
    }
    formData.append("clientType",clientType);
    formData.append("paymentType",paymentType);
    

    return this.http.post<any>(this.host+"/orders/add", formData);
  }
  


}
