import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  
  public host : string = this.authService.host;

  constructor(private authService: AuthService,private http: HttpClient) { }
  
  public uploadCoverProductCategory(file : File, categoryID:any) {
    let data=new FormData();
    data.append("file",file);
    data.append("categoryID",categoryID);
    return this.http.post<any>(this.host+"/productCategory/saveCoverImage",data);
  }

  public checkProductCategory(name: string, parentName:string) {
    let data = new FormData();
    data.append("name",name);
    data.append("parentName",parentName);
    return this.http.post<any>(this.host+"/productCategory/checkProductCategory",data);
  }

  public deleteProductCategory(productCategoryID: any){
    return this.http.delete(this.host+'/productCategory/delete/'+productCategoryID);
  }

  public loadAllProductCategories(){
    return this.http.get(this.host+'/productCategory/getAll');
  }

  public addProductCategory(name: string, parentName:any, description:string ) {
    let data = new FormData();
    data.append("name",name);
    data.append("parentName",parentName);
    data.append("description",description);
    return this.http.post<any>(this.host+"/productCategory/add",data);
  }

  public updateProductCategory(categoryID:any, name: string, parentName:any, description:string ) {
    let data = new FormData();
    data.append("categoryID",categoryID);
    data.append("name",name);
    data.append("parentName",parentName);
    data.append("description",description);
    return this.http.put<any>(this.host+"/productCategory/update",data);
  }

  public changeStatus(pCategoryID:any, status:any){
    const formData = new FormData();
    formData.append('pCategoryID',pCategoryID);
    formData.append('status',status);
    return this.http.post<any>(this.host+'/productCategory/changeStatus', formData);
  }
}
