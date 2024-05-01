import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from '../services/promotion.service';

@Component({
  selector: 'app-dialog-add-promotion',
  templateUrl: './dialog-add-promotion.component.html',
  styleUrls: ['./dialog-add-promotion.component.css']
})
export class DialogAddPromotionComponent implements OnInit {
  isEditMode:any=false;
  promotionAdded:any;
  codePromo:any=null;
  promoType:any=null;
  discountValue:any=null;
  minDate!: Date;
  startDate:any=null;
  endDate:any=null;
  isDateRange:any=false;
  discountType:any=null;
  formattedStartDate:any;
  formattedEndDate:any;
  isValueShown:any=false;
  promo:any;


  constructor(public dialogRef: MatDialogRef<DialogAddPromotionComponent>,private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService, private promotionService: PromotionService) {
      this.minDate = new Date();
      if (data.isEditMode){
        console.log(data);
        this.isEditMode = data.isEditMode;
        this.promo = data.promotion;
        this.codePromo = this.promo.code;
        this.promoType = this.promo.promoType;
        if (this.promoType == 'period')
           this.isDateRange = true;
        else
          this.isDateRange = false;
        this.discountType = this.promo.discountType;
        this.startDate = this.promo.startDate;
        this.endDate = this.promo.expiryDate;
        this.discountValue = this.promo.discountValue;
        if (this.discountValue != null){
          this.isValueShown = true;
        }
        else {
          this.isValueShown = false;
        }
        if (this.promo.startDate != 'null' && this.promo.expiryDate != 'null'){
          this.startDate = this.convertDate(this.promo.startDate);
          this.endDate = this.convertDate(this.promo.expiryDate);
          this.isDateRange = true;
        }
        else{
          this.isDateRange = false;
        }

      }
     }

  ngOnInit(): void {

  }

  convertDate(mydate:any){
    //exp : '30/11/2023'
    const [day, month, year] = mydate.split('/');
    return new Date(`${year}-${month}-${day}`);
  }

  checkData(){
   if ((this.codePromo != null && this.codePromo.length > 0) && (this.promoType != null && this.discountType != null)){
      if (this.isDateRange){
          if (this.startDate != null && this.endDate != null){
            this.formattedStartDate = this.formatDate(this.startDate);
            this.formattedEndDate = this.formatDate(this.endDate);
            //add
            if (!this.isEditMode){
              this.promotionService.addPromotion(this.codePromo,this.promoType,this.discountType,this.discountValue,this.formattedStartDate,this.formattedEndDate).subscribe((res:any) =>{
                if (res.message == "Promotion added successfully."){
                  this.toastr.success("Votre nouvelle promotion a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
                  this.promotionAdded = true;
                  this.dialogRef.close();
                }
                else if (res.message == "Promotion already exist."){
                  this.toastr.error("Cette promotion existe déjà.", 'Erreur', {timeOut: 3000 });
                  this.promotionAdded = false;
                }
                else{
                  this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
                  this.promotionAdded = false;
                }
              });
            }
            else{
              // update
              this.promotionService.updatePromotion(this.promo.id, this.codePromo,this.promoType,this.discountType,this.discountValue,this.formattedStartDate,this.formattedEndDate).subscribe((res:any) =>{
                if (res.message == "Promotion updated successfully."){
                  this.toastr.success("Votre promotion a été mis a jour avec succès!", 'Opération réussie', {timeOut: 3000 });
                  this.promotionAdded = true;
                  this.dialogRef.close();
                }
                else if (res.message == "Promotion not exist."){
                  this.toastr.error("Cette promotion n'existe pas.", 'Erreur', {timeOut: 3000 });
                  this.promotionAdded = false;
                }
                else{
                  this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
                  this.promotionAdded = false;
                }
              });
            }
          }
          else{
            this.toastr.error("Entrez la période du promotion!", 'Erreur', {timeOut: 3000 });
          }
      }
      else{
        if (!this.isEditMode){
          //add
          this.promotionService.addPromotion(this.codePromo,this.promoType,this.discountType,this.discountValue,null,null).subscribe((res:any) =>{
            if (res.message == "Promotion added successfully."){
              this.toastr.success("Votre nouvelle promotion a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
              this.promotionAdded = true;
              this.dialogRef.close();
            }
            else if (res.message == "Promotion already exist."){
              this.toastr.error("Cette promotion existe déjà.", 'Erreur', {timeOut: 3000 });
              this.promotionAdded = false;
            }
            else{
              this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
              this.promotionAdded = false;
            }
          });
        }
        else{
          //update
          this.promotionService.updatePromotion(this.promo.id,this.codePromo,this.promoType,this.discountType,this.discountValue,null,null).subscribe((res:any) =>{
            if (res.message == "Promotion updated successfully."){
              this.toastr.success("Votre promotion a été mis a jour avec succès!", 'Opération réussie', {timeOut: 3000 });
              this.promotionAdded = true;
              this.dialogRef.close();
            }
            else if (res.message == "Promotion not exist."){
              this.toastr.error("Cette promotion n'existe pas.", 'Erreur', {timeOut: 3000 });
              this.promotionAdded = false;
            }
            else{
              this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
              this.promotionAdded = false;
            }
          });
        }
      }
   }
   else{
    this.toastr.error("Vérifiez vos informations!", 'Erreur', {timeOut: 3000 });

   }

  }

  onSelectDiscountType(type: any): void {
    if (type == "free_shipping"){
      this.isValueShown = false;
    }
    else{
      this.isValueShown = true;
    }
  }

  checkValue(){
    if (this.discountType != null){
      //fixed amount
      if (this.discountType == "fixed_amount"){
        if (this.discountValue != null && this.discountValue < 0){
          this.discountValue = 0;
        }
      }
      //percent
      if (this.discountType == "percent"){
        if (this.discountValue != null && this.discountValue < 0){
          this.discountValue = 0;
        }
        if (this.discountValue != null && this.discountValue > 100){
          this.discountValue = 100;
        }
      }
    }
  }

  formatDate(dateString: any): any {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }
  
  onSelectedPromoType(value: any) {
    console.log("VALUE = " + value);
  
    if (value == 'period')
      this.isDateRange = true;
    else
      this.isDateRange = false;
  }
  

  cancel() {
    this.dialogRef.close();
  }

  

}
