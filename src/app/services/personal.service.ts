import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private authService: AuthService,private http: HttpClient) { }

  public host : string = this.authService.host;

  public addPersonal(data: any){
    return this.http.post<any>(this.host+'/employee/add', data);
  }

  public loadPersonals(){
    return this.http.get(this.host+'/employee/getAll');
  }

  public deletePersonal(userid: string){
    return this.http.delete(this.host+'/employee/delete/'+userid);
  }

  public updatePersonal(data: any){
    return this.http.put<any>(this.host+'/employee/update', data);
  }

  public changePersonalStatus(userid:string, status:any){
    const formData = new FormData();
    formData.append('userid',userid);
    formData.append('status',status);
    return this.http.post<any>(this.host+'/employee/changeStatus', formData);
  }

}
