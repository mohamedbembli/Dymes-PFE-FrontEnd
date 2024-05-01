import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  @Input() homePage:any=true;
  @Input() settingsPage:any=false;

  storeData:any=null;
  //Coordonnées de la boutique
  storeName:any=null;
  tvaCode:any=null;
  phone1:any=null;
  phone2:any=null;
  state:any=null;
  city:any=null;
  address:any=null;
  zipCode:any=null;
  pays:any=null;
  email:any=null;
  //Coordonnées bancaires
  bnkName:any=null;
  designation:any=null;
  agence:any=null;
  swift:any=null; 
  iban:any=null;
  //Méthode de paiement
  payWithBank:any=false;
  payInDelivery:any=true;
  paymentByDefault:any=null;
  //Logos
  photoFileLogo:any=null;
  isRealImageLogo:any=false;
  selectPhotoLogo:any=0;
  imagePreviewLogo:any=null;

  photoFileFavicon:any=null;
  isRealImageFavicon:any=false;
  selectPhotoFavicon:any=0;
  imagePreviewFavicon:any=null;

  imagesList:any=[];
  //Réseaux sociaux
  facebookLink:any=null;
  instagramLink:any=null;
  linkedinLink:any=null;
  whatsappLink:any=null;
  snapchatLink:any=null;
  tiktokLink:any=null;
  youtubeLink:any=null;
  //SEO - Référencement
  seoDescription:any=null;
  seoStoreUrl:any=null;
  seoTitle:any=null;




  constructor(private authService: AuthService, private adminService: AdminService, private storeService: StoreService,private toastr: ToastrService) {

   }

  ngOnInit(): void {
    this.loadStoreData();
  }

  setPrincipalSettings(){
    this.homePage = false;
    this.settingsPage = true;
  }

  loadStoreData(){
    this.storeService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
      //Coordonnées de la boutique
      this.storeName = this.storeData.name;
      this.tvaCode = this.storeData.tvaCode;
      this.phone1 = this.storeData.phone1;
      this.phone2 = this.storeData.phone2;
      this.state = this.storeData.state;
      this.city = this.storeData.city;
      this.address = this.storeData.address;
      this.zipCode = this.storeData.zipCode;
      this.pays = this.storeData.pays;
      this.email = this.storeData.email;
      //Coordonnées bancaires
      this.bnkName = this.storeData.bankName;
      this.designation = this.storeData.designation;
      this.agence = this.storeData.agence;
      this.swift = this.storeData.swift;
      this.iban = this.storeData.iban;
      //Logos
      if (this.storeData.logo != null){
         this.imagePreviewLogo = this.authService.host+"/public/store/logo";
         this.selectPhotoLogo = 1;
      }
      else{
        this.photoFileLogo=null;
        this.isRealImageLogo=false;
        this.selectPhotoLogo=0;
        this.imagePreviewLogo=null;
      }

      if (this.storeData.icon != null){
         this.imagePreviewFavicon = this.authService.host+"/public/store/icon";
         this.selectPhotoFavicon = 1;
      }
      else{
        this.photoFileFavicon=null;
        this.isRealImageFavicon=false;
        this.selectPhotoFavicon=0;
        this.imagePreviewFavicon=null;
      }
      //Méthode de paiement
      this.payInDelivery = this.storeData.payInDelivery;
      this.payWithBank = this.storeData.payWithBank;
      this.paymentByDefault = this.storeData.paymentByDefault;
      //Réseaux sociaux
      this.facebookLink = this.storeData.facebookLink;
      this.instagramLink = this.storeData.instagramLink;
      this.linkedinLink  = this.storeData.linkedinLink;
      this.whatsappLink = this.storeData.whatsappLink;
      this.snapchatLink = this.storeData.snapchatLink;
      this.tiktokLink = this.storeData.tiktokLink;
      this.youtubeLink = this.storeData.youtubeLink;
      //SEO
      this.seoDescription = this.storeData.seoDescription;
      this.seoStoreUrl = this.storeData.seoStoreUrl;
      this.seoTitle = this.storeData.seoTitle;

    });
  }


  saveSEO(){
    let errSEO:any=false;
    if ((this.seoStoreUrl != null && this.seoStoreUrl.length > 0 ) && !this.isValidUrl(this.seoStoreUrl)){
        errSEO = true;
        this.toastr.error("Veuillez entrer une URL correcte !", 'Erreur', {timeOut: 3000 });
    }
    if (!errSEO){
      this.storeService.updateSEO(this.seoDescription, this.seoStoreUrl, this.seoTitle).subscribe((res:any) => {
        if (res.message == "SEO Data updated success."){
          this.toastr.success("Vos données SEO - Référencement ont été mis à jour avec succès !", 'Opération réussie', {timeOut: 3000 });
        }
        else{
          this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
        }
      });
    }
  }
  saveSocialMedia(){
    let errSocialMedia:any=false;
    if ((this.facebookLink != null && this.facebookLink.length > 0 ) && !this.isValidUrl(this.facebookLink)){
        errSocialMedia = true;
        this.toastr.error("Veuillez entrer une URL Facebook correcte !", 'Erreur', {timeOut: 3000 });
    }
    if ((this.instagramLink != null && this.instagramLink.length > 0 ) && !this.isValidUrl(this.instagramLink)){
        errSocialMedia = true;
        this.toastr.error("Veuillez entrer une URL Instagram correcte !", 'Erreur', {timeOut: 3000 });
    }
    if ((this.linkedinLink != null && this.linkedinLink.length > 0 ) && !this.isValidUrl(this.linkedinLink)){
      errSocialMedia = true;
      this.toastr.error("Veuillez entrer une URL Linkedin correcte !", 'Erreur', {timeOut: 3000 });
    }
    if ((this.whatsappLink != null && this.whatsappLink.length > 0 ) && !this.isValidUrl(this.whatsappLink)){
      errSocialMedia = true;
      this.toastr.error("Veuillez entrer une URL Whatsapp correcte !", 'Erreur', {timeOut: 3000 });
    }
    if ((this.snapchatLink != null && this.snapchatLink.length > 0 ) && !this.isValidUrl(this.snapchatLink)){
      errSocialMedia = true;
      this.toastr.error("Veuillez entrer une URL Snapchat correcte !", 'Erreur', {timeOut: 3000 });
    }
    if ((this.tiktokLink != null && this.tiktokLink.length > 0 ) && !this.isValidUrl(this.tiktokLink)){
      errSocialMedia = true;
      this.toastr.error("Veuillez entrer une URL TikTok correcte !", 'Erreur', {timeOut: 3000 });
    }
    if ((this.youtubeLink != null && this.youtubeLink.length > 0 ) && !this.isValidUrl(this.youtubeLink)){
      errSocialMedia = true;
      this.toastr.error("Veuillez entrer une URL YouTube correcte !", 'Erreur', {timeOut: 3000 });
    }

    if (!errSocialMedia){
      this.storeService.updateSocialMediaData(this.facebookLink, this.instagramLink, this.linkedinLink, this.whatsappLink, this.snapchatLink, this.tiktokLink, this.youtubeLink).subscribe((res:any) => {
        if (res.message == "Social Media Data updated success."){
          this.toastr.success("Vos comptes de réseaux sociaux ont été mis à jour avec succès !", 'Opération réussie', {timeOut: 3000 });
        }
        else{
          this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
        }
      });
    }
  }

  savePayMethodes(){
    this.storeService.updatePayMethodes(this.payWithBank,this.payInDelivery,this.paymentByDefault).subscribe((res:any) => {
      if (res.message == "PayMethodes Data updated success."){
        this.toastr.success("Vos méthodes de paiement a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
      }
      else{
        this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
      }
    });
  }

  saveLogos(){
    if ((this.photoFileLogo == null && this.photoFileFavicon == null) && (this.selectPhotoLogo == 0 && this.selectPhotoFavicon == 0)){
      this.toastr.error("Il est nécessaire de télécharger au moins un logo/favicon.", 'Erreur', {timeOut: 3000 });
    }
    else{
      this.imagesList = [];
        //logo
        if (this.photoFileLogo != null){
          const extension = this.photoFileLogo.name.split('.').pop();
          const file  = this.base64ToFile(this.imagePreviewLogo,"logo",extension);
          this.imagesList.push(file);
        }
        //favicon
        if (this.photoFileFavicon != null){
          const extension = this.photoFileFavicon.name.split('.').pop();
          const file  = this.base64ToFile(this.imagePreviewFavicon,"icon",extension);
          this.imagesList.push(file);
        }
        this.storeService.updateLogos(this.imagesList).subscribe((res:any) => {
          if (res.message == "Logos updated success."){
            this.toastr.success("Vos Logos a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
      }
      else{
        this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
      }
      });
    }
  }

  base64ToFile(base64: string, inputFileName: string, imageType: string): File | null {
    try {
      const dataUriPrefix = `data:image/${imageType};base64,`;

      if (base64.startsWith(dataUriPrefix)) {
        base64 = base64.slice(dataUriPrefix.length);
      }

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const filename = `${inputFileName}.${imageType}`;
      const blob = new Blob([byteArray], { type: `image/${imageType}` });

      const file = new File([blob], filename, { type: `image/${imageType}` });
      return file;

    } catch (error) {
      console.error('Error converting base64 to File:', error);
      return null;
    }
}

  saveStoreInfo(){
    this.storeService.updateStoreData(this.storeName,this.tvaCode,this.phone1,this.phone2,this.state,this.city,this.address,this.zipCode,this.pays,this.email).subscribe((res:any) => {
      if (res.message == "Store Data updated success."){
        this.toastr.success("Vos coordonnées de la boutique a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
      }
      else{
        this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
      }
    });
  }

  saveBnkInfo(){
    if ((this.bnkName != null && this.swift !=null) && this.iban!= null ){
      this.storeService.updateBankData(this.bnkName,this.designation,this.agence,this.swift,this.iban).subscribe((res:any) => {
        if (res.message == "Bank Data updated success."){
          this.toastr.success("Vos coordonnées de bancaires a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
        }
        else{
          this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
        }
      });
    }
    else{
      this.toastr.error("Compléter vos informations!", 'Erreur', {timeOut: 3000 });
    }
  }

  selectFileLogo(evt: any){
    if(evt.target.files.length>0){
      this.photoFileLogo=evt.target.files[0];
      console.log(this.photoFileLogo);
      this.adminService.checkRealImage(this.photoFileLogo).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImageLogo = true;
          this.selectPhotoLogo = 1;
          if (this.photoFileLogo && this.selectPhotoLogo == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreviewLogo = e.target.result;
            };
            reader.readAsDataURL(this.photoFileLogo);
          }
        }
        else{
          this.toastr.error(res.message, 'Erreur', {timeOut: 3000 });
        }
      },
      (error) => {
        console.error(error);
        this.isRealImageLogo = false;
        this.selectPhotoLogo = 0;
        this.toastr.error(error.error.message, 'Erreur', {timeOut: 3000 });
      });
      
    }
  }

  selectFileFavicon(evt: any){
    if(evt.target.files.length>0){
      this.photoFileFavicon=evt.target.files[0];
      console.log(this.photoFileFavicon);
      this.adminService.checkRealImage(this.photoFileFavicon).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImageFavicon = true;
          this.selectPhotoFavicon = 1;
          if (this.photoFileFavicon && this.selectPhotoFavicon == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreviewFavicon = e.target.result;
            };
            reader.readAsDataURL(this.photoFileFavicon);
          }
        }
        else{
          this.toastr.error(res.message, 'Erreur', {timeOut: 3000 });
        }
      },
      (error) => {
        console.error(error);
        this.isRealImageFavicon = false;
        this.selectPhotoFavicon = 0;
        this.toastr.error(error.error.message, 'Erreur', {timeOut: 3000 });
      });
      
    }
  }

  onCheckpayInDelivery(){
    if (this.payInDelivery == true){
      this.payInDelivery = false;
    }
    else{
      this.payInDelivery = true;
    }
    console.log("payInDelivery = "+this.payInDelivery);
  }

  onCheckpayWithBank(){
    if (this.payWithBank == true){
      this.payWithBank = false;
    }
    else{
      this.payWithBank = true;
    }
    console.log("payWithBank = "+this.payWithBank);
  }

  isValidUrl(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlPattern.test(url);
  }

}
