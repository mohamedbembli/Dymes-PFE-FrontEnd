import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private authService: AuthService,private http: HttpClient) { }

  public host : string = this.authService.host;



  public getAll(){
    return this.http.get(this.host+"/product/getAll");
  }

  public getProduct(id:any){
    return this.http.get(this.host+"/product/get/"+id);
  }

  downloadImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  public updateProduct(productID:any, dataToSend: any, imagesToUpload: any, variantsImages:any) {
    const formData = new FormData();
    formData.append('productID',productID);
    formData.append('dataToSend', JSON.stringify(dataToSend));

    for (let i = 0; i < imagesToUpload.length; i++) {
      formData.append('imagesToUpload', imagesToUpload[i]);
    }

    if (variantsImages != null){
      for (let i = 0; i < variantsImages.length; i++) {
        formData.append('variantsImages', variantsImages[i]);
      }
    }
   
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.put<string>(`${this.host}/product/update`, formData, { headers });
  }


  public addProduct(dataToSend: any, imagesToUpload: any, variantsImages:any) {
    const formData = new FormData();
    formData.append('dataToSend', JSON.stringify(dataToSend));

    for (let i = 0; i < imagesToUpload.length; i++) {
      formData.append('imagesToUpload', imagesToUpload[i]);
    }

    for (let i = 0; i < variantsImages.length; i++) {
      formData.append('variantsImages', variantsImages[i]);
    }

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post<string>(`${this.host}/product/add`, formData, { headers });
  }
}
