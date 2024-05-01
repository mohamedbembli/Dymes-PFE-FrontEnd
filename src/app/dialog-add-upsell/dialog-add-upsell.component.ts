import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { UpsellService } from '../services/upsell.service';

@Component({
  selector: 'app-dialog-add-upsell',
  templateUrl: './dialog-add-upsell.component.html',
  styleUrls: ['./dialog-add-upsell.component.css']
})
export class DialogAddUpsellComponent implements OnInit {

  upsellAdded:any=false;
  isEditMode:any=false;
  
  upSellName:any=null;
  headerType:any=null;
  header:any=null;
  bodyType:any=null;
  body:any=null;
  footerType:any=null;
  footer:any=null;

  buttonsPosition:any="afterBody";

  btnConfirmText:any="Oui je confirme";
  btnConfirmTextColor:any="#ffffff";
  btnConfirmColor:any="#22a554";
  btnConfirmSize:any="medium";
  
  btnCancelText:any="Non j'annule";
  btnCancelTextColor:any="#ffffff";
  btnCancelColor:any="#ff0000";
  btnCancelSize:any="medium";

  creationDate:any;

  imagePreviewHeader:any;
  selectPhotoHeader:any=0;
  photoFileHeader:any=null;
  isRealImageHeader:any;

  imagePreviewBody:any;
  selectPhotoBody:any=0;
  photoFileBody:any=null;
  isRealImageBody:any;

  imagePreviewFooter:any;
  selectPhotoFooter:any=0;
  photoFileFooter:any=null;
  isRealImageFooter:any;

  productsList:any;
  selectedProduct:any=null;
  selectedNextProduct:any=null;

  globalErr:any=false;
  imagesList:any;
  dataToSend:any;

  upsellID:any=null;

  

  constructor(private authService: AuthService, private adminService: AdminService, private datePipe: DatePipe, private productService: ProductService, public dialogRef: MatDialogRef<DialogAddUpsellComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService, private upSellService: UpsellService) {
      if (data.isEditMode){
        this.isEditMode = true;
        this.upSellName = data.upsell.name;
        this.upsellID = data.upsell.id;
        // header
        this.headerType = data.upsell.headerType;
        if (this.headerType == "image"){
          this.header = null;
          this.selectPhotoHeader = 1;
          this.imagePreviewHeader =  this.authService.host+"/public/upsell/"+data.upsell.id+"/header"
        } 
        if (this.headerType == "text" || this.headerType == "video"){
          this.header = data.upsell.header;
          this.selectPhotoHeader = 0;
          this.imagePreviewHeader = null;
        }
        // body
        this.bodyType = data.upsell.bodyType;
        if (this.bodyType == "image"){
          this.body = null;
          this.selectPhotoBody = 1;
          this.imagePreviewBody =  this.authService.host+"/public/upsell/"+data.upsell.id+"/body"
        } 
        if (this.bodyType == "text" || this.bodyType == "video"){
          this.body = data.upsell.body;
          this.selectPhotoBody = 0;
          this.imagePreviewBody = null;
        }
         // footer
         this.footerType = data.upsell.footerType;
         if (this.footerType == "image"){
           this.footer = null;
           this.selectPhotoFooter = 1;
           this.imagePreviewFooter =  this.authService.host+"/public/upsell/"+data.upsell.id+"/footer"
         } 
         if (this.footerType == "text" || this.footerType == "video"){
           this.footer = data.upsell.footer;
           this.selectPhotoFooter = 0;
           this.imagePreviewFooter = null;
         }
         //buttonsPosition
         this.buttonsPosition = data.upsell.buttonsPosition;
         // button confirm
         this.btnConfirmText = data.upsell.btnConfirmText;
         this.btnConfirmTextColor = data.upsell.btnConfirmTextColor;
         this.btnConfirmColor = data.upsell.btnConfirmColor;
         this.btnConfirmSize = data.upsell.btnConfirmSize;
         // button cancel
         this.btnCancelText = data.upsell.btnCancelText;
         this.btnCancelTextColor = data.upsell.btnCancelTextColor;
         this.btnCancelColor = data.upsell.btnCancelColor;
         this.btnCancelSize = data.upsell.btnCancelSize;
         // offer products
         this.productService.getProduct(data.upsell.upsellProductID).subscribe((res:any) => {
            this.selectedProduct = res;
         });
         this.productService.getProduct(data.upsell.nextProductID).subscribe((res:any) => {
          this.selectedNextProduct = res;
       });

     }

    }

    compareUpsells(upsell1: any, upsell2: any): boolean {
      return upsell1.name === upsell2.name && upsell1.id === upsell2.id;
    }
    
  sendData(){
    this.globalErr = false;
    this.imagesList = [];

    // add UpSell
    if (!this.isEditMode){
      if ( (this.upSellName != null &&  this.upSellName.length > 0 ) ){
        // verify header
          if (this.headerType != null){
            if (this.headerType == 'text' || this.headerType == 'video'){
              if (this.header == null || this.header.length <= 0){
                this.toastr.error("Contenu de Entête est obligatoire!", 'Erreur', {timeOut: 3000 });
                this.globalErr = true;
              }
            }
           if (this.headerType == 'image'){
              if (this.photoFileHeader == null){
                this.toastr.error("Image de Contenu de Entête manquant!", 'Erreur', {timeOut: 3000 });
                this.globalErr = true;
              }
              else{
                this.header = null;
                const extension = this.photoFileHeader.name.split('.').pop();
                const file  = this.base64ToFile(this.imagePreviewHeader,"header",extension);
                console.log("new header file = "+file);
                this.imagesList.push(file);
              }
            }
          }
         // verify body
         if (this.bodyType != null){
          if (this.bodyType == 'text' || this.bodyType == 'video'){
            if (this.body == null || this.body.length <= 0){
              this.toastr.error("Contenu de Corps est obligatoire!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
          }
         if (this.bodyType == 'image'){
            if (this.photoFileBody == null){
              this.toastr.error("Image de Contenu de Corps manquant!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
            else{
              this.body = null;
              const extension = this.photoFileBody.name.split('.').pop();
              const file  = this.base64ToFile(this.imagePreviewBody,"body",extension);
              console.log("new body file = "+file);
              this.imagesList.push(file);
            }
          }
        }
        // verify footer
        if (this.footerType != null){
          if (this.footerType == 'text' || this.footerType == 'video'){
            if (this.footer == null || this.footer.length <= 0){
              this.toastr.error("Contenu de bas de page est obligatoire!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
          }
         if (this.footerType == 'image'){
            if (this.photoFileFooter == null){
              this.toastr.error("Image de Contenu de bas de page manquant!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
            else{
              this.footer = null;
              const extension = this.photoFileFooter.name.split('.').pop();
              const file  = this.base64ToFile(this.imagePreviewFooter,"footer",extension);
              console.log("new footer file = "+file);
              this.imagesList.push(file);
            }
          }
        }
        // verify product and next product
        if (this.selectedProduct == null || this.selectedNextProduct == null){
          this.toastr.error("Vérifiez la partie détails de l'offre !", 'Erreur', {timeOut: 3000 });
          this.globalErr = true;
        }
        // verify button confirmer
        if (this.btnConfirmText == null || this.btnConfirmText.length <= 0){
          this.toastr.error("Configurer le texte du bouton confirmer !", 'Erreur', {timeOut: 3000 });
          this.globalErr = true;
        }
         // verify button annuler
         if (this.btnCancelText == null || this.btnCancelText.length <= 0){
          this.toastr.error("Configurer le texte du bouton annuler !", 'Erreur', {timeOut: 3000 });
          this.globalErr = true;
        }
      }
      else{
        this.toastr.error("Le nom de UpSell est obligatoire!", 'Erreur', {timeOut: 3000 });
        this.globalErr = true;
      }
    }
    // Modify UpSell
    if (this.isEditMode){
      if ( (this.upSellName != null &&  this.upSellName.length > 0 ) ){
        // verify header
          if (this.headerType != null){
            if (this.headerType == 'text' || this.headerType == 'video'){
              if (this.header == null || this.header.length <= 0){
                this.toastr.error("Contenu de Entête est obligatoire!", 'Erreur', {timeOut: 3000 });
                this.globalErr = true;
              }
            }
           if (this.headerType == 'image'){
              if (this.photoFileHeader == null && this.selectPhotoHeader == 0){
                this.toastr.error("Image de Contenu de Entête manquant!", 'Erreur', {timeOut: 3000 });
                this.globalErr = true;
              }
              if (this.photoFileHeader != null && this.selectPhotoHeader == 1){
                this.header = null;
                const extension = this.photoFileHeader.name.split('.').pop();
                const file  = this.base64ToFile(this.imagePreviewHeader,"header",extension);
                this.imagesList.push(file);
                console.log("imagesList = "+this.imagesList);
              }
            }
          }
         // verify body
         if (this.bodyType != null){
          if (this.bodyType == 'text' || this.bodyType == 'video'){
            if (this.body == null || this.body.length <= 0){
              this.toastr.error("Contenu de Corps est obligatoire!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
          }
         if (this.bodyType == 'image'){
            if (this.photoFileBody == null  && this.selectPhotoBody == 0){
              this.toastr.error("Image de Contenu de Corps manquant!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
            if (this.photoFileBody != null  && this.selectPhotoBody == 1){
              this.body = null;
              const extension = this.photoFileBody.name.split('.').pop();
              const file  = this.base64ToFile(this.imagePreviewBody,"body",extension);
              this.imagesList.push(file);
              console.log("imagesList = "+this.imagesList);

            }
          }
        }
        // verify footer
        if (this.footerType != null){
          if (this.footerType == 'text' || this.footerType == 'video'){
            if (this.footer == null || this.footer.length <= 0){
              this.toastr.error("Contenu de bas de page est obligatoire!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
          }
        if (this.footerType == 'image'){
            if (this.photoFileFooter == null && this.selectPhotoFooter == 0){
              this.toastr.error("Image de Contenu de bas de page manquant!", 'Erreur', {timeOut: 3000 });
              this.globalErr = true;
            }
            if (this.photoFileFooter != null && this.selectPhotoFooter == 1){
              this.footer = null;
              const extension = this.photoFileFooter.name.split('.').pop();
              const file  = this.base64ToFile(this.imagePreviewFooter,"footer",extension);
              this.imagesList.push(file);
              console.log("imagesList = "+this.imagesList);

            }
          }
        }
        // verify product and next product
        if (this.selectedProduct == null || this.selectedNextProduct == null){
          this.toastr.error("Vérifiez la partie détails de l'offre !", 'Erreur', {timeOut: 3000 });
          this.globalErr = true;
        }
        // verify button confirmer
        if (this.btnConfirmText == null || this.btnConfirmText.length <= 0){
          this.toastr.error("Configurer le texte du bouton confirmer !", 'Erreur', {timeOut: 3000 });
          this.globalErr = true;
        }
         // verify button annuler
         if (this.btnCancelText == null || this.btnCancelText.length <= 0){
          this.toastr.error("Configurer le texte du bouton annuler !", 'Erreur', {timeOut: 3000 });
          this.globalErr = true;
        }
      }
      else{
        this.toastr.error("Le nom de UpSell est obligatoire!", 'Erreur', {timeOut: 3000 });
        this.globalErr = true;
      }
    }
    
    console.log("this.imagesList = "+this.imagesList);
    console.log("dataToSend = "+this.dataToSend);

    // check global error and send data
    if (!this.globalErr){
      this.creationDate = this.formatDate(new Date());
      this.dataToSend = null;
      this.dataToSend = {
        upsellID: this.upsellID,
        upSellName: this.upSellName,
        headerType: this.headerType,
        headerContent: this.header,
        bodyType: this.bodyType,
        bodyContent: this.body,
        footerType: this.footerType,
        footerContent: this.footer,
        productID: this.selectedProduct.id,
        nextProductID: this.selectedNextProduct.id,
        btnConfirmText: this.btnConfirmText,
        btnConfirmTextColor: this.btnConfirmTextColor,
        btnConfirmColor: this.btnConfirmColor,
        btnConfirmSize: this.btnConfirmSize,
        btnCancelText: this.btnCancelText,
        btnCancelTextColor: this.btnCancelTextColor,
        btnCancelColor: this.btnCancelColor,
        btnCancelSize: this.btnCancelSize,
        buttonsPosition: this.buttonsPosition,
        creationDate: this.creationDate
      };

      //add
      if (!this.isEditMode){
        this.upSellService.addUpsell(this.dataToSend,this.imagesList).subscribe((res:any) => {
          if (res.message == "UpSell added success."){
            this.toastr.success("Votre UpSell a été ajouté avec succès!", 'Opération réussie', {timeOut: 3000 });
            this.upsellAdded = true;
            this.dialogRef.close();
          }
          else if (res.message == "UpSell already exist."){
            this.toastr.error("Cette UpSell existe déja.", 'Erreur', {timeOut: 3000 });
            this.upsellAdded = false;
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
            this.upsellAdded = false;
          }
        });
      }
      // modify
      else {
        this.upSellService.updateUpsell(this.dataToSend,this.imagesList).subscribe((res:any) => {
          if (res.message == "UpSell updated success."){
            this.toastr.success("Votre UpSell a été mis a jour avec succès!", 'Opération réussie', {timeOut: 3000 });
            this.upsellAdded = true;
            this.dialogRef.close();
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
            this.upsellAdded = false;
          }
        });
      }
      
    }
  }

  ngOnInit(): void {
    this.loadAllProducts();
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

  formatDate(dateString: any): any {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }
  
  loadAllProducts(){
    this.productService.getAll().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.productsList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.productsList = res;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.productsList = null;
      }
      
       
    });
  }

  onSelectedProduct(event:any){
    this.selectedProduct = event;
  }
  onSelectedNextProduct(event:any){
    this.selectedNextProduct = event;
  }

  selectFileHeader(evt: any) {
    if(evt.target.files.length>0){
      this.photoFileHeader=evt.target.files[0];
      console.log(this.photoFileHeader);
      this.adminService.checkRealImage(this.photoFileHeader).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImageHeader = true;
          this.selectPhotoHeader = 1;
          if (this.photoFileHeader && this.selectPhotoHeader == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreviewHeader = e.target.result;
            };
            reader.readAsDataURL(this.photoFileHeader);
          }
        }
        else{
          this.toastr.error(res.message, 'Erreur', {timeOut: 3000 });
        }
      },
      (error) => {
        console.error(error);
        this.isRealImageHeader = false;
        this.selectPhotoHeader = 0;
        this.toastr.error(error.error.message, 'Erreur', {timeOut: 3000 });
      });
      
    }
  }

  selectFileBody(evt: any) {
    if(evt.target.files.length>0){
      this.photoFileBody = evt.target.files[0];
      console.log(this.photoFileBody);
      this.adminService.checkRealImage(this.photoFileBody).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImageBody = true;
          this.selectPhotoBody = 1;
          if (this.photoFileBody && this.selectPhotoBody == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreviewBody = e.target.result;
            };
            reader.readAsDataURL(this.photoFileBody);
          }
        }
        else{
          this.toastr.error(res.message, 'Erreur', {timeOut: 3000 });
        }
      },
      (error) => {
        console.error(error);
        this.isRealImageBody = false;
        this.selectPhotoBody = 0;
        this.toastr.error(error.error.message, 'Erreur', {timeOut: 3000 });
      });
      
    }
  }

  selectFileFooter(evt: any) {
    if(evt.target.files.length>0){
      this.photoFileFooter = evt.target.files[0];
      console.log(this.photoFileFooter);
      this.adminService.checkRealImage(this.photoFileFooter).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImageFooter = true;
          this.selectPhotoFooter = 1;
          if (this.photoFileFooter && this.selectPhotoFooter == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreviewFooter = e.target.result;
            };
            reader.readAsDataURL(this.photoFileFooter);
          }
        }
        else{
          this.toastr.error(res.message, 'Erreur', {timeOut: 3000 });
        }
      },
      (error) => {
        console.error(error);
        this.isRealImageFooter = false;
        this.selectPhotoFooter = 0;
        this.toastr.error(error.error.message, 'Erreur', {timeOut: 3000 });
      });
      
    }
  }

  onSelectHeaderType(event:any){
    if (event == 'text' || event == 'video'){
      this.header = null;
      this.photoFileHeader = null;
    }
    if (event == 'image'){
      this.header = null;
    }
    this.headerType = event;

  }

  onSelectBodyType(event:any){
    if (event == 'text' || event == 'video'){
      this.body = null;
      this.photoFileBody = null;
    }
    if (event == 'image'){
      this.body = null;
    }
    this.bodyType = event;

  }

  onSelectfooterType(event:any){
    if (event == 'text' || event == 'video'){
      this.footer = null;
      this.photoFileFooter = null;
    }
    if (event == 'image'){
      this.footer = null;
    }
    this.footerType = event;
  }


  



  cancel(){
    this.dialogRef.close();
  }

}
