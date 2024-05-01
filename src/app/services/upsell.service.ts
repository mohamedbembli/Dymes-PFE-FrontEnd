import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UpsellService {

  constructor(private authService: AuthService,private http: HttpClient) { }

  public host : string = this.authService.host;

  public getAll(){
    return this.http.get(this.host+"/upsell/getAll");
  }

  downloadImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  public changeUpsellStatus(upsellID:string, status:any){
    const formData = new FormData();
    formData.append('upsellID',upsellID);
    formData.append('status',status);
    return this.http.post<any>(this.host+'/upsell/changeStatus', formData);
  }

  public deleteUpsell(upsellID: string){
    return this.http.delete(this.host+'/upsell/delete/'+upsellID);
  }

  public addUpsell(dataToSend: any, imagesList: any) {
    const formData = new FormData();
    formData.append('dataToSend', JSON.stringify(dataToSend));

    for (let i = 0; i < imagesList.length; i++) {
      formData.append('imagesList', imagesList[i]);
    }
    
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post<string>(`${this.host}/upsell/add`, formData, { headers });
  }

  public updateUpsell(dataToSend: any, imagesList: any) {
    const formData = new FormData();
    formData.append('dataToSend', JSON.stringify(dataToSend));

    for (let i = 0; i < imagesList.length; i++) {
      formData.append('imagesList', imagesList[i]);
    }
    
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.put<string>(`${this.host}/upsell/update`, formData, { headers });
  }

}
