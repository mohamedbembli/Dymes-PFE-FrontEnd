import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private authService: AuthService,private http: HttpClient) { }

  public host : string = this.authService.host;


  getUserById(userId:any) {
    return this.http.get(this.host+"/admin/retrieve-user/"+userId);
  }

  public uploadPhotoProfile(file : File) {
    let data=new FormData();
    data.append("file",file);
    return this.http.post<any>(this.host+"/admin/savePhotoProfile",data);
  }

  public savePrivData(bio:string, email:string){
    let data = new FormData();
    data.append("bio",bio);
    data.append("email",email);
    return this.http.post<any>(this.host+'/admin/savePrivData', data);
  }

  public saveSecondsData(gender:string, firstName:string, lastName:string, address:string, phone:string, dob:string, country:string, city:string, state:string, zipcode:string){
    let data = new FormData();
    data.append("gender",gender);
    data.append("firstName",firstName);
    data.append("lastName",lastName);
    data.append("address",address);
    data.append("phone",phone);
    data.append("dob",dob);
    data.append("country",country);
    data.append("city",city);
    data.append("state",state);
    data.append("zipcode",zipcode);
    
    return this.http.post<any>(this.host+'/admin/saveSecondData', data);
  }

  public checkRealImage(file : any){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.host+'/admin/checkUploadedFile', formData);

  }

  public checkPassword(pass: any){
    const formData = new FormData();
    formData.append('password',pass);
    return this.http.post<any>(this.host+'/admin/checkPassword', formData);
  }

  public updatePassword(pass: any){
    const formData = new FormData();
    formData.append('password',pass);
    return this.http.post<any>(this.host+'/admin/updatePassword', formData);
  }

  public loadUser(){
    return this.http.get(this.host+"/admin/loadUser");
  }

  public loadClients(){
    return this.http.get(this.host+'/admin/getAllClients');
  }

  public loadRatings(){
    return this.http.get(this.host+'/admin/getAllRating');
  }

  public loadClaims(){
    return this.http.get(this.host+'/admin/getAllClaims');
  }

  public changeClientStatus(userid:string, status:any){
    const formData = new FormData();
    formData.append('userid',userid);
    formData.append('status',status);
    return this.http.post<any>(this.host+'/admin/changeClientStatus', formData);
  }

  public acceptRating(ratingID:string){
    const formData = new FormData();
    formData.append('ratingID',ratingID);
    return this.http.post<any>(this.host+'/admin/acceptRating', formData);
  }

  public deleteRating(ratingID: any){
    return this.http.delete(this.host+'/admin/deleteRating/'+ratingID);
  }

  public changeClaimStatus(claimID:string){
    const formData = new FormData();
    formData.append('claimID',claimID);
    return this.http.post<any>(this.host+'/admin/changeClaimStatus', formData);
  }

  public loadAllOrderLifeCycle(){
    return this.http.get(this.host+'/admin/getAllOrderLifeCycle');
  }

  public loadAllOrders(){
    return this.http.get(this.host+'/admin/getAllOrders');
  }

  public changeOrderStatus(orderID:any ,previousStepID:any, nextStepID:any){
    const formData = new FormData();
    formData.append('orderID',orderID);
    formData.append('previousStepID',previousStepID);
    formData.append('nextStepID',nextStepID);
    return this.http.post<any>(this.host+'/admin/changeOrderStatus', formData);
  }

}
