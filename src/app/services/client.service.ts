import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public host : string = this.authService.host;

  constructor(private authService: AuthService,private http: HttpClient) { }

  public loadUser(){
    return this.http.get(this.host+"/client/loadUser");
  }

  public updateAddress(gender:any, firstName:any, lastName:any, address:any, phone:any, phone2:any, city:any, zipCode:any){
    const formData = new FormData();
    formData.append('gender',gender);
    formData.append('firstName',firstName);
    formData.append('lastName',lastName);
    formData.append('address',address);
    formData.append('phone',phone);
    formData.append('phone2',phone2);
    formData.append('city',city);
    formData.append('zipCode',zipCode);
    return this.http.post<any>(this.host+'/client/updateAddress', formData);
  }

  public deleteAddress(){
    return this.http.delete<any>(this.host+'/client/removeAddress');
  }

   // add client order
   public addClientOrder(checkoutForm: any, totalPrices:any, totalWithTax:any, shippingFees:any, promotion:any, clientType:any, paymentType:any) {
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
    

    return this.http.post<any>(this.host+"/client/orders/addClientOrder", formData);
  }

  //fastCheckoutClient
  public fastCheckoutClient(fullName: string, phone:string, address: string, productID:any, qte:any,shippingFees:any,
    totalWithTax:any, description:any, total:any, productType:any, productName:any){
    const formData = new FormData();
    formData.append('fullName',fullName);
    formData.append('phone',phone);
    formData.append('address',address);
    formData.append('shippingFees',shippingFees);
    formData.append('totalWithTax',totalWithTax);
    // orderproductData
    formData.append('productID',productID);
    formData.append('productType',productType);
    formData.append('productName',productName);
    formData.append('qte',qte);
    formData.append('description',description);
    formData.append('total',total);

    return this.http.post<any>(this.host+'/client/orders/addFastCheckoutClient', formData);
  }

  public cancelOrder(orderID:any){
    const formData = new FormData();
    formData.append('orderID',orderID);
    return this.http.post<any>(this.host+'/client/orders/cancelOrder', formData);
  }

  public getOrders(){
    return this.http.get(this.host+"/client/orders/getOrders");
  }

  public addClaim(subject:any, comment:any, orderID:any){
    const formData = new FormData();
    formData.append('orderID',orderID);
    formData.append('subject',subject);
    formData.append('comment',comment);
    return this.http.post<any>(this.host+'/client/orders/addClaim', formData);
  }

 

}
