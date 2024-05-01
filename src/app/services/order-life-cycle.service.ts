import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderLifeCycleService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  public host : string = this.authService.host;

  public getAll(){
    return this.http.get(this.host+"/orderLifeCycle/getAll");
  }

  public updateStatus(stepID:any, status:any){
    let data = new FormData();
    data.append("stepID",stepID);
    data.append("status",status);
    return this.http.put<any>(this.host+'/orderLifeCycle/updateStatus', data);
  }

  public deleteStep(stepID: any){
    return this.http.delete(this.host+'/orderLifeCycle/delete/'+stepID);
  }

  public updatePosition(oldPosition:any, newPosition:any){
    let data = new FormData();
    data.append("oldPosition",oldPosition);
    data.append("newPosition",newPosition);
    return this.http.put<any>(this.host+'/orderLifeCycle/updatePosition', data);

  }

  public updateStep(stepID:any, stepName:any, logo:any, action:any){
    let data = new FormData();
    data.append("stepID",stepID);
    data.append("stepName",stepName);
    data.append("action",action);
    if (logo != null){
      data.append("logo",logo);
    }
    
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.put<string>(`${this.host}/orderLifeCycle/update`, data, { headers });
  }

  public addStep(stepName:any, logo:any, action:any){
    let data = new FormData();
    data.append("stepName",stepName);
    data.append("action",action);
    if (logo != null){
      data.append("logo",logo);
    }
    
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post<string>(`${this.host}/orderLifeCycle/add`, data, { headers });
  }


}
