import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { ProductCategoryService } from '../services/product-category.service';

@Component({
  selector: 'app-dialog-add-category-product',
  templateUrl: './dialog-add-category-product.component.html',
  styleUrls: ['./dialog-add-category-product.component.css']
})
export class DialogAddCategoryProductComponent implements OnInit {

  categoryProductAdded:any = false;

  selectPhoto:any; // init selectPhoto 0
  isRealImage:any = false;
  isPhotoUpdated = false;
  photoFile!: File;
  imagePreview: any;
  errorPreviewImage:any = "";

  isEditMode:any;

  categoryParent:any = null;
  categoryName!:string;
  categoryDescription!:string;
  listAllCategories:any;
  categoryID:any;
  


  constructor(private adminService: AdminService,public dialogRef: MatDialogRef<DialogAddCategoryProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService, private productCategoryService: ProductCategoryService) { 

      if (data.isEditMode){
        this.isEditMode = data.isEditMode;
        // set Data to form
        this.categoryName = data.productCategoryData.name;
        this.categoryDescription = data.productCategoryData.description;
        this.categoryParent = data.productCategoryData.categoryParent;
        this.categoryID = data.productCategoryData.id;
      }
    }

  ngOnInit(): void {
    this.selectPhoto = 0; // init selectPhoto 0
    this.isRealImage = false;
    this.isPhotoUpdated = false;

    // load all Categories
    this.productCategoryService.loadAllProductCategories().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.listAllCategories = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.listAllCategories = res;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.listAllCategories = null;
      }
      
       
    });
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }

  checkData(){
    if (!this.isEditMode){
      if (this.categoryName.length > 1 && this.categoryDescription.length > 1 && this.selectPhoto == 1 && this.isRealImage == true){
        // we need to check if this product category is already exist
        this.productCategoryService.checkProductCategory(this.categoryName,this.categoryParent).subscribe({next: res => {
          this.toastr.error("Cette catégorie existe déja!", 'Erreur', {timeOut: 2000 });
        },
        error: err => {
          if (err.status == 404) {
            console.log("check data , add category step");
            // add category and upload image
            this.productCategoryService.addProductCategory(this.categoryName,this.categoryParent,this.categoryDescription).subscribe({next: res1 => {
                console.log("add category , upload cover step");
                // upload image
                this.onUpload(res1.message.id);
              },
              error: err1 => {
                if (err1.status == 500) {
                  this.toastr.error("Erreur interne! Réssayer SVP!", 'Erreur', {timeOut: 2000 });
                }
              }
          });
          }
          else if (err.status == 404) {
            this.toastr.error("Erreur interne! Réssayer SVP!", 'Erreur', {timeOut: 2000 });
          }
        }
      });
  
    }
    else {
      this.toastr.error("Vérifiez vos informations", 'Erreur', {timeOut: 3000 });
    }
    }
    // if isEditMode
    else {
      if (this.categoryName.length > 1 && this.categoryDescription.length > 1){
           // update category and upload image
           this.productCategoryService.updateProductCategory(this.categoryID, this.categoryName,this.categoryParent,this.categoryDescription).subscribe({next: res1 => {
            console.log("add category , upload cover step");
              // upload image
              if (this.selectPhoto == 1 && this.isRealImage == true){
                this.onUpload(res1.message.id);
              }
              else {
                this.categoryProductAdded = true;
                this.dialogRef.close();
              }
            },
            error: err1 => {
              if (err1.status == 500) {
                this.toastr.error("Erreur interne! Réssayer SVP!", 'Erreur', {timeOut: 2000 });
              }
            }
        });
      }
    else {
      this.toastr.error("Vérifiez vos informations", 'Erreur', {timeOut: 3000 });
    }
  }
}

  onUpload(categoryid:any) {
    this.productCategoryService.uploadCoverProductCategory(this.photoFile,categoryid).subscribe((res:any) => {
      if (res.message == "Photo updated successfully"){
        this.isPhotoUpdated = true;
        // Product category added succes        
        this.categoryProductAdded = true;
        this.dialogRef.close();
      }
      
    },
    (error) => {
      this.toastr.error(error.error.message, 'Error', {timeOut: 2000 });
    });
  }

  selectFile(evt: any) {
    if(evt.target.files.length>0){
      this.photoFile=evt.target.files[0];
      console.log(this.photoFile);
      this.adminService.checkRealImage(this.photoFile).subscribe((res:any) => {
        if (res.message == "Merci! Sauvegarder maintenant."){
          this.isRealImage = true;
          this.selectPhoto = 1;
          this.errorPreviewImage = res.message;
          if (this.photoFile && this.selectPhoto == 1) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(this.photoFile);
          }
        }
      },
      (error) => {
        console.error(error);
        this.isRealImage = false;
        this.selectPhoto = 0;
        this.errorPreviewImage = error.error.message;
      });
      
    }
  }

  onSelected(value:string): void {
    this.categoryParent = value;
    console.log("new product category parent = "+ this.categoryParent);
  }

}
