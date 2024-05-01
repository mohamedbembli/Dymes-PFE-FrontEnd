import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  public host : string = this.authService.host;

  public addElement(attributeID:any, name:any, reference:any){
    let data = new FormData();
    data.append("attributeID",attributeID);
    data.append("name",name);
    data.append("reference",reference);
    return this.http.post<any>(this.host+'/elements/add', data);
  }

  public getElementsByAttribute(attributeID:any){
    return this.http.get(this.host+"/elements/getElements/"+attributeID);
  }

  public deleteElement(attributeID:any, name:any, reference:any){
    let data = new FormData();
    data.append("attributeID",attributeID);
    data.append("name",name);
    data.append("reference",reference);
    return this.http.post<any>(this.host+'/elements/delete',data);
  }

}
