import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  public host : string = this.authService.host;


  public loadAllAttributes(){
    return this.http.get(this.host+"/attributes/getAll");
  }

  public getNbElementsByID(attributeID:any){
    return this.http.get(this.host+"/attributes/getNbElements/"+attributeID);
  }

  public deleteAttribute(attributeID: any){
    return this.http.delete(this.host+'/attributes/delete/'+attributeID);
  }

  public addAttribute(name:any, type:any){
    let data = new FormData();
    data.append("name",name);
    data.append("type",type);
    return this.http.post<any>(this.host+'/attributes/add', data);
  }

  public updateAttribute(attributeID:any, name: string, type:any) {
    let data = new FormData();
    data.append("attributeID",attributeID);
    data.append("name",name);
    data.append("type",type);
    return this.http.put<any>(this.host+"/attributes/update",data);
  }
}
