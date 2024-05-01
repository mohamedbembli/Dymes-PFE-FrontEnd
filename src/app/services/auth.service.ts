import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserProfile } from '../model/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public host : string ="http://localhost:9092";
  public userProfile: UserProfile | null =null;
  public ts:number=0;
  public profilePhoto:any;
  public userData:any;


  constructor(private http: HttpClient, private router: Router) {

  }

  public login(email : string, password : string){
    let options= {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    let params=new HttpParams()
      .set("grantType","password")
      .set('email',email)
      .set('password',password)
      .set('withRefreshToken',true)
    return this.http.post(this.host+"/public/auth", params,options);
  }

  public authenticateUser(idToken : any){
    let jwtHelperService=new JwtHelperService();
    let accessToken=idToken['access-token'];
    let refreshToken = idToken['refresh-token'];
    let decodedJWTAccessToken = jwtHelperService.decodeToken(accessToken);
    this.userProfile= {
      userId : decodedJWTAccessToken.sub,
      email : decodedJWTAccessToken.email,
      scope : decodedJWTAccessToken.scope,
      accessToken : accessToken,
      refreshToken:refreshToken,
      profilePhoto: this.host+"/public/profilePhoto/"+decodedJWTAccessToken.sub
    }
    if (!this.hasRole("USER")){
      localStorage.setItem('userProfile',JSON.stringify(this.userProfile));
    }
  }

  public authenticateUserClient(idToken : any, role:any){
    let jwtHelperService=new JwtHelperService();
    let accessToken=idToken['access-token'];
    let refreshToken = idToken['refresh-token'];
    let decodedJWTAccessToken = jwtHelperService.decodeToken(accessToken);
    this.userProfile= {
      userId : decodedJWTAccessToken.sub,
      email : decodedJWTAccessToken.email,
      scope : decodedJWTAccessToken.scope,
      accessToken : accessToken,
      refreshToken:refreshToken,
      profilePhoto: this.host+"/public/profilePhoto/"+decodedJWTAccessToken.sub
    }
  }

  public refreshToken(refreshToken:string){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
      .set("grantType", "refreshToken")
      .set("refreshToken",this.userProfile!.refreshToken)
      .set("email",this.userProfile!.email)
      .set('withRefreshToken',true)
    return this.http.post(this.host+"/public/auth?rt", params,options)
  }

  logout(){
    if (this.hasRole("ADMIN") || this.hasRole("EMPLOYEE")){
      this.userProfile=null;
      localStorage.removeItem("userProfile");
      localStorage.removeItem("admUSER");
      this.router.navigateByUrl("/loginAdm");
    }
    else{
      this.userProfile=null;
      localStorage.removeItem("userProfile");
      localStorage.removeItem("admUSER");
      this.router.navigateByUrl("/loginUsr");

    }
  }
  
  isAuthenticated() {
   // console.log("is authenticated func userProfile="+this.userProfile);
   return this.userProfile != null;

  }

  loadProfile(){
    let profile =localStorage.getItem("userProfile");
    if(profile==undefined) return;
    let item = JSON.parse(profile);
    this.authenticateUser({"access-token":item.accessToken,"refresh-token":item.refreshToken});
  }


  public hasRole(role : string) :boolean{
    if(!this.userProfile) return false;
    console.log(this.userProfile.scope);
    console.log(role);
    console.log(this.userProfile.scope.includes(role));
    return this.userProfile.scope.includes(role);
  }

  public forgotPass(email: string){
    const formData = new FormData();
    formData.append('email',email);
    return this.http.post<any>(this.host+'/public/forgotPassword', formData);
  }

  public requestForPasswordInit(authorizationCode: string, email:string){
    const formData = new FormData();
    formData.append('authorizationCode',authorizationCode);
    formData.append('email',email);
    return this.http.post<any>(this.host+'/public/requestForPasswordInit', formData);
  }

  public updatePass(pass: string, email:string){
    const formData = new FormData();
    formData.append('pass',pass);
    formData.append('email',email);
    return this.http.post<any>(this.host+'/public/updatePassword', formData);
  }

  public loadModules(pass: string, email:string){
    const formData = new FormData();
    formData.append('pass',pass);
    return this.http.post<any>(this.host+'/public/updatePassword', formData);
  }

  public loadUser(){
    return this.http.get(this.host+"/admin/loadUser");
  }
  // store
  public getStoreData(){
    return this.http.get(this.host+"/public/getStoreData");
  }
  // store
  public getProductCategories(){
    return this.http.get(this.host+"/public/getProductCategories");
  }
  //store
  public getProducts(){
    return this.http.get(this.host+"/public/getAllProducts");
  }
  // favorites
  getVariantsStockCount(productId: any){
    return this.http.get(this.host+"/public/getVariantsStock/"+productId);
  }

  getProduct(productId: any){
    return this.http.get(this.host+"/public/getProduct/"+productId);
  }

  getAttribute(attributeID:any){
    return this.http.get(this.host+"/public/attribute/"+attributeID);
  }

  public getAllAttributes(){
    return this.http.get(this.host+"/public/getAllAttributes");
  }

  getPromotion(promoCode: any){
    return this.http.get(this.host+"/public/promotion/"+promoCode);
  }

  //checkoutFields
  public getCheckoutFieldsData(){
    return this.http.get(this.host+"/public/checkoutFields/getAll");
  }

  //add guest order
  public addOrder(checkoutForm: any, totalPrices:any, totalWithTax:any, shippingFees:any, promotion:any, clientType:any, paymentType:any) {
    const formData = new FormData();
    const checkoutDataArray = [];

    for (const key in checkoutForm) {
      if (checkoutForm.hasOwnProperty(key)) {
        if (key != "Créer un compte")
        checkoutDataArray.push({ key: key, value: checkoutForm[key] });
      }
    }   

    formData.append("checkoutDataArray",JSON.stringify(checkoutDataArray));
    formData.append("totalPrices",JSON.stringify(totalPrices));
    formData.append("totalWithTax",totalWithTax);
    formData.append("shippingFees",shippingFees);
    if (promotion != null){
      formData.append("promotion",JSON.stringify(promotion));
    }
    else{
      formData.append("promotion","null");
    }
    formData.append("clientType",clientType);
    formData.append("paymentType",paymentType);
    

    return this.http.post<any>(this.host+"/public/orders/add", formData);
  }
  //fastCheckout
  public fastCheckoutGuest(fullName: string, phone:string, address: string, productID:any, qte:any,shippingFees:any,
    totalWithTax:any, description:any, total:any, productType:any, productName:any){
    const formData = new FormData();
    formData.append('fullName',fullName);
    formData.append('phone',phone);
    formData.append('address',address);
    formData.append('shippingFees',shippingFees);
    formData.append('totalWithTax',totalWithTax);
    // orderproductData
    formData.append('productID',productID);
    formData.append('productType',productType);
    formData.append('productName',productName);
    formData.append('qte',qte);
    formData.append('description',description);
    formData.append('total',total);

    return this.http.post<any>(this.host+'/public/orders/addFastCheckout', formData);
  }
  //Client
  public addClient(email: string, pass:string, confirmPass: string){
    const formData = new FormData();
    formData.append('email',email);
    formData.append('pass',pass);
    formData.append('confirmPass',confirmPass);
    return this.http.post<any>(this.host+'/public/addClient', formData);
  }
  //ANYONE
  public addRating(fullname: string, emailOrPhone:string, comment:string, stars: any, productID:any){
    const formData = new FormData();
    formData.append('fullname',fullname);
    formData.append('emailOrPhone',emailOrPhone);
    formData.append('comment',comment);
    formData.append('stars',stars);
    formData.append('productID',productID);
    return this.http.post<any>(this.host+'/public/addRating', formData);
  }

  public loadRatings(productID:any){
    return this.http.get(this.host+'/public/getAllRatingPublic/'+productID);
  }

  public getOrder(orderID: any){
    return this.http.get(this.host+"/public/order/"+orderID);
  }

  public getUpsellOffer(upsellID: any){
    return this.http.get(this.host+"/public/upsellOffer/"+upsellID);
  }

  public cancelUpsell(upsellID:any){
    const formData = new FormData();
    formData.append('upsellID',upsellID);
    return this.http.post<any>(this.host+'/public/cancelUpsell', formData);
  }

  public approveUpsell(upsellID:any){
    const formData = new FormData();
    formData.append('upsellID',upsellID);
    return this.http.post<any>(this.host+'/public/approveUpsell', formData);
  }
  

}
