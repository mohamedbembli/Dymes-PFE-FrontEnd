import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutConfigurationService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  public host : string = this.authService.host;

  public UpdateOrderConfirmationMSG(msg:string){
    const formData = new FormData();
    formData.append('msg',msg);
    return this.http.put<any>(this.host+'/checkoutField/updateOrderConfirmationMSG', formData);
  }

  public updateShown(fieldID:string){
    const formData = new FormData();
    formData.append('fieldID',fieldID);
    return this.http.put<any>(this.host+'/checkoutField/updateShown', formData);
  }

  public updateIsRequired(fieldID:string){
    const formData = new FormData();
    formData.append('fieldID',fieldID);
    return this.http.put<any>(this.host+'/checkoutField/updateIsRequired', formData);
  }
  
  public getAll(){
    return this.http.get(this.host+"/checkoutField/getAll");
  }
  
}
