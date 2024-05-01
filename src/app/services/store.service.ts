import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private authService: AuthService,private http: HttpClient) { }

  public host : string = this.authService.host;

  public updateLogos(imagesList: any) {
    const formData = new FormData();

    for (let i = 0; i < imagesList.length; i++) {
      formData.append('imagesList', imagesList[i]);
    }
    
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.put<string>(`${this.host}/store/updateLogos`, formData, { headers });
  }

  public getStoreData(){
    return this.http.get(this.host+"/store/getStoreData");
  }

  public updateStoreData(storeName:any, tvaCode:any, phone1:any, phone2:any, state:any, city:any, address:any, zipCode:any, pays:any, email:any){
    const formData = new FormData();
    formData.append('storeName',storeName);
    formData.append('tvaCode',tvaCode);
    formData.append('phone1',phone1);
    formData.append('phone2',phone2);
    formData.append('state',state);
    formData.append('city',city);
    formData.append('address',address);
    formData.append('zipCode',zipCode);
    formData.append('pays',pays);
    formData.append('email',email);
    return this.http.put<any>(this.host+'/store/updateStoreData', formData);
  }

  public updateSocialMediaData(facebookLink:any, instagramLink:any, linkedinLink:any, whatsappLink:any, snapchatLink:any, tiktokLink:any, youtubeLink:any){
    const formData = new FormData();
    formData.append('facebookLink',facebookLink);
    formData.append('instagramLink',instagramLink);
    formData.append('linkedinLink',linkedinLink);
    formData.append('whatsappLink',whatsappLink);
    formData.append('snapchatLink',snapchatLink);
    formData.append('tiktokLink',tiktokLink);
    formData.append('youtubeLink',youtubeLink);
    return this.http.put<any>(this.host+'/store/updateSocialMediaData', formData);
  }

  public updateBankData(bnkName:any, designation:any, agence:any, swift:any, iban:any){
    const formData = new FormData();
    formData.append('bnkName',bnkName);
    formData.append('designation',designation);
    formData.append('agence',agence);
    formData.append('swift',swift);
    formData.append('iban',iban);
    return this.http.put<any>(this.host+'/store/updateBankData', formData);
  }

  public updatePayMethodes(payWithBank:any, payInDelivery:any, paymentByDefault:any){
    const formData = new FormData();
    formData.append('payWithBank',payWithBank);
    formData.append('payInDelivery',payInDelivery);
    formData.append('paymentByDefault',paymentByDefault);
    return this.http.put<any>(this.host+'/store/updatePayMethodes', formData);
  }

  public updateSEO(seoDescription:any, seoStoreUrl:any, seoTitle:any){
    const formData = new FormData();
    formData.append('seoDescription',seoDescription);
    formData.append('seoStoreUrl',seoStoreUrl);
    formData.append('seoTitle',seoTitle);
    return this.http.put<any>(this.host+'/store/updateSEO', formData);
  }

  public updateShippingFees(shippingFees:any,totalCMD:any){
    const formData = new FormData();
    formData.append('shippingFees',shippingFees);
    formData.append('totalCMD',totalCMD);
    return this.http.put<any>(this.host+'/store/updateShippingFees', formData);
  }

  
}
