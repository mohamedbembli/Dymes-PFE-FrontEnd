import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private authService: AuthService,private http: HttpClient) { }

  public host : string = this.authService.host;

  public getAll(){
    return this.http.get(this.host+"/promotion/getAll");
  }

  public addPromotion(promoCode:any, promoType:any, discountType:any, discountValue:any, startDate:any, endDate:any) {
    const formData = new FormData();
    formData.append('promoCode', promoCode);
    formData.append('promoType', promoType);
    formData.append('discountType', discountType);
    formData.append('discountValue', discountValue);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    
    return this.http.post<string>(`${this.host}/promotion/add`, formData);
  }


  public updatePromotion(idPromo:any, promoCode:any, promoType:any, discountType:any, discountValue:any, startDate:any, endDate:any) {
    const formData = new FormData();
    formData.append('idPromo', idPromo);
    formData.append('promoCode', promoCode);
    formData.append('promoType', promoType);
    formData.append('discountType', discountType);
    formData.append('discountValue', discountValue);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    
    return this.http.put<string>(`${this.host}/promotion/update`, formData);
  }

  public updateStatus(promoID:any,status:any){
    const formData = new FormData();
    formData.append('promoID', promoID);
    formData.append('status', status);

    return this.http.put<string>(`${this.host}/promotion/updateStatus`, formData);
  }


  public deletePromo(promoID:any){

    return this.http.delete<string>(this.host+"/promotion/delete/"+promoID);
  }
}
