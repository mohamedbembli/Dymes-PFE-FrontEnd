import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { AttributeService } from '../services/attribute.service';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductService } from '../services/product.service';
declare var $: any;



@Component({
  selector: 'app-dialog-add-product',
  templateUrl: './dialog-add-product.component.html',
  styleUrls: ['./dialog-add-product.component.css']

})
export class DialogAddProductComponent implements OnInit{

  isEditMode:any;
  productData:any;
  productDataCategory:any= null;
  productID:any;
  variantData:any;
  dataToSend:any;
  updatedVariantsFiles:any;
  productUpdated:any;


  // General variable
  productName:string="";
  productBarCode:any = null;
  productRef:any = null;
  productSupplier:any = null;
  // timer section
  nbHours:any=null;
  // live  visitors section
  startRange:any=null;
  endRange:any=null;
  // status variable
  productStatus:any="actif";
  // price variable
  buyPrice:any=null;
  sellPrice:any=null;
  tax:any=0;
  //reduction simple
  simpleReductionType:any="fixed";
  simpleReductionValue:any=null;
  //Réduction par formules
  discountTable: any = [];
  //Product category
  productCategoryID:any;
  listProductCategories:any=null;
  subCategoryList:any=null;
  parentCat:any=null;
  subCat:any=null;
  //end Product Category
  // init stock
  stockPrincipal:any = null;
  // shipping price
  shippingPrice:any=null;

  productAdded:any = false;
  reductionType:any="fixed";


  //variants section
  isVariantsGenerated:any=false;
  defaultVariant:any = null;
  variantsImages: File[] = [];
  variantsTable:any = [];
  newVariantsTable:any = [];
  attributesList:any;
  selectedElements:any;
  attributesMap: { [key: string]: string[] } = {};
  generatedVariants:any=null;
  defaultVariantImage: string | ArrayBuffer | null = '';
  showVariantsTable:any = false;

  toggleValues: boolean[] = [];
  toggleValuesActifStatus: boolean[] = [];
  selectedRowIndex: any = -1;
  //end variants section


  //images 
  imagesForm:any = new FormData();;
  imagesToUpload: File[] = [];
  imagePreviews: string[] = [];
  selectedImages:any=null;
  principalImages:any=null;
  selectPhoto:any;
  isRealImage:any;
  errorPreviewImage:any = "";
  fileInputLabel:any;
  filesSize:any=0;

  filesSelected = false;
  imageOrder: number[] = [];


  draggedIndex: number | null = null;

  //end image

  isCollapsedGeneral = false;
  isCollapsedStatusProduct = false;
  isCollapsedPrice = false;
  isCollapsedCategory = false;
  isCollapsedImages = false; 
  isCollapsedStock = false; 
  isCollapsedVariants = false; 
  isCollapsedShippingPrice = false; 
  isCollapsedVisitorsRange = false;
  isCollapsedTimer = false;
  //

  htmlContent:any = "";

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    toolbarHiddenButtons: [
      [

      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.slice(lastDotIndex + 1).toLowerCase() : 'unknown';
  }

  constructor(public dialogRef: MatDialogRef<DialogAddProductComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  private productService: ProductService, private attributeService: AttributeService,private toastr: ToastrService, private productCategoryService :ProductCategoryService, private adminService: AdminService) {
    // initalize image files count
    this.fileInputLabel =  "Importer des images";

    // load all Categories
    this.loadProductsCategories();
    // load all Attributes
    this.loadAllAttributes();
    this.productUpdated = false;
    this.variantsTable = [];
    this.variantsImages = [];
    this.variantData = [];
    this.productData = null;
    if (data.isEditMode){
      this.isEditMode = data.isEditMode;
       this.productService.getProduct(data.productData.id).subscribe((res:any) =>{
        this.productData = res;
        // general sections
        this.productID = this.productData.id;
        this.productName = this.productData.name;
        this.htmlContent = this.productData.description;
        this.productBarCode = this.productData.barCode;
        this.productRef = this.productData.reference;
        this.productSupplier = this.productData.supplier;
        // images section
        this.imagePreviews = [];
        this.principalImages = [];
        this.filesSize = this.productData.productImages?.length;
  
        if (this.productData.productImages?.length > 0) {
          const downloadObservables = this.productData.productImages?.map((image: any) =>
            this.productService.downloadImage("http://localhost:9092/public/productImage/" + image.id)
          );
  
          forkJoin(downloadObservables).subscribe((responses: any) => {
              // Combine responses with productImages
              const imageResponses = responses.map((blob: Blob, index: number) => {
                const image = this.productData.productImages[index];
                return { blob, image };
              });
          
              // Sort imageResponses based on position
              imageResponses.sort((a:any, b:any) => a.image.position - b.image.position);
          
              // Process the sorted responses
              imageResponses.forEach(({ blob, image }: { blob: Blob, image: { id: number, imageName: string, position: number } }) => {
                const fileExtension = this.getFileExtension(image.imageName);
                const fileName = image.imageName;
          
                const file: File = new File([blob], fileName, { type: 'image/' + fileExtension });
          
                this.principalImages.push(file);
                this.imagePreviews.push("http://localhost:9092/public/productImage/" + image.id);
              });
              this.selectedImages = this.principalImages;
              this.loadImagePreviews();
            },
            (error: any) => {
              console.error('Error downloading images:', error);
            }
          );
          
          
        }
  
        
        // status section
        this.productStatus = this.productData.status;
        // category section
        this.productCategoryID = this.productData.category?.id;
        this.productDataCategory = this.productData.category;
        this.parentCat = null;
        this.subCat = null;
        if (this.productDataCategory.categoryParent == 'null'){
          this.parentCat = this.productDataCategory;
        }
        else {
          this.getParentCategoryByName(this.productDataCategory.categoryParent);
          this.subCat = this.productDataCategory;
        }
        // shippingPrice section
        this.shippingPrice = this.productData.shippingPrice;
        // price section
        this.buyPrice = this.productData.buyPrice;
        this.sellPrice = this.productData.sellPrice;
        this.tax = this.productData.tva;
        this.simpleReductionType = this.productData.simpleDiscountType;
        this.simpleReductionValue = this.productData.simpleDiscountValue;
        if (this.productData.discounts?.length > 0 ){
          this.discountTable = [];
          this.productData.discounts.forEach((discount:any) => {
            this.discountTable.push({
                qte: discount.quantity,
                type: discount.type,
                reduction: discount.value,
                finalPrice: discount.finalPrice,
            });
          }); 
        }
        // stock section
        this.stockPrincipal = this.productData.stock;      
        // variants             
        this.variantsTable = [];
        this.variantData = [];
        this.variantsImages = [];
        if (this.productData.variants?.length > 0) {
          const downloadObservables = this.productData.variants.map((variant: any) =>
            this.productService.downloadImage("http://localhost:9092/public/variant/" + variant.id)
          );
    
        forkJoin(downloadObservables).subscribe((responses: any) => {
            responses.forEach((blob: Blob, index: number) => {
              const variant = this.productData.variants[index];
              const fileExtension = this.getFileExtension(variant.image);
              const fileName = variant.image;
    
              const file: File = new File([blob], fileName, { type: 'image/' + fileExtension });
              this.variantsImages.push(file);
    
              let elements: string[] = [];
              for (let j = 0; j < variant.elements.length; j++) {
                elements.push(variant.elements[j].name);
              }
              this.variantsTable.push({
                attributes: elements,
                image: "http://localhost:9092/public/variant/" + variant.id,
                stock: variant.stock,
                price: variant.price,
                defaultVariant: variant.variantByDefault,
                actif: variant.actif,
              });
              this.variantData = this.variantsImages;
              this.saveVariantData(this.variantData);
            });
         //   this.saveImagesPositions();
          },
          (error: any) => {
            console.error('Error downloading images:', error);
          }
        );
        this.showVariantsTable = true;
    }
        // live visitors section
        this.startRange = this.productData.visitorsRange?.rangeFrom;
        this.endRange = this.productData.visitorsRange?.rangeTo;
        // timer section
        this.nbHours = this.productData.timer?.nbHours;
      
       });
  }


  }


  compareCategories(category1: any, category2: any): boolean {
    return category1.name === category2.name && category1.id === category2.id;
  }
  

  ngOnInit(): void {
  }
   

  saveProduct(){
    if (this.checkGeneralSection()){
        if (this.checkPriceSection()){
          if (this.checkCategorySection()){
            if (this.checkStockSection()){
                if (this.checkVisitorsRangeSection()){
                  if (this.checkShippingPriceSection()){
                  if (this.checkTimerSection()){
                    // save product by sending it to backend
                     this.dataToSend = null;
                     this.dataToSend = {
                      // general sections
                      productName: this.productName,
                      description: this.htmlContent,
                      productBarCode: this.productBarCode,
                      productRef: this.productRef,
                      productSupplier: this.productSupplier,
                      // status section
                      productStatus: this.productStatus,
                      // category section
                      productCategoryID: this.productCategoryID,
                      // shippingPrice section
                      shippingPrice: this.shippingPrice,
                      // price section
                      buyPrice: this.buyPrice,
                      sellPrice: this.sellPrice,
                      tax: this.tax,
                      reductionType: this.simpleReductionType,
                      reductionValue: this.simpleReductionValue,
                      discountTable: this.discountTable,
                      // stock section
                      stock: this.stockPrincipal,                      
                      // variants section
                      variants: this.variantsTable,
                      // live visitors section
                      visitorStartRange: this.startRange,
                      visitorsEndRange: this.endRange,
                      // timer section
                      nbHoursTimer: this.nbHours
                    };
                    if (!this.isEditMode){
                      console.log("add product");
                      this.productService.addProduct(this.dataToSend,this.imagesToUpload,this.variantsImages).subscribe((res:any) =>{
                        if (res.message == "Product added success."){
                          this.toastr.success("Votre nouvelle produit a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
                          this.productAdded = true;
                          this.dialogRef.close();
                        }
                        else{
                          this.productAdded = false;
                          this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
                        }
                    });
                    }
                    else {
                      if (this.variantData == null || this.variantData.length == 0){
                        this.variantData = this.updatedVariantsFiles;
                      }
                      this.productService.updateProduct(this.productID,this.dataToSend,this.imagesToUpload,this.variantData).subscribe((res:any) =>{
                        if (res.message == "Product updated success."){
                          this.productUpdated = true;
                          this.productData = null;
                          this.dialogRef.close();
                        }
                        else{
                          this.productAdded = false;
                          this.toastr.error("Erreur! réessayer plus tard", 'Erreur', {timeOut: 3000 });
                        }
                      });
                    }
                  }
                }
              }
            }
          }
        }
    }
  }

  saveVariantData(variantsFiles: File[]){
    this.variantsImages = variantsFiles;
    this.variantData = variantsFiles;
    this.updatedVariantsFiles = variantsFiles;
  }

  convertBase64ToFiles(variantsTable: any[]) {
    this.variantData = [];
    variantsTable.forEach((variant: any) => {
      const imageType = this.getImageTypeFromBase64(variant.image);

      if (imageType != null) {
        const file = this.base64ToFile(variant.image, imageType);
          if (file != null) {
            if (variant.image != null){
              variant.image = file.name;
              this.variantsImages.push(file);
            }
          }
        }
        });
        this.variantData = this.variantsImages;
  }
  getImageTypeFromBase64(base64: string): string {
    if (typeof base64 === 'string' && base64.length > 0) {
      const regex = /^data:image\/([a-zA-Z]+);base64,/;
      const match = base64.match(regex);
  
      if (match && match[1]) {
        return match[1];
      }
  }
  return "";
}
  
  
  base64ToFile(base64: string, imageType: string): File | null {
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
        const fileName = `image_${new Date().getTime()}.${imageType}`;
        const blob = new Blob([byteArray], { type: `image/${imageType}` });

        const file = new File([blob], fileName, { type: `image/${imageType}` });
        return file;

      } catch (error) {
        console.error('Error converting base64 to File:', error);
        return null;
      }
  }
  
  // sections verification 
  checkGeneralSection():boolean{
    if (this.productName.length <= 0){
      this.toastr.error("Vérifiez le nom de produit!",'Général', {timeOut: 5000 });
    }
    if (this.htmlContent.length <= 0){
      this.toastr.error("Vérifiez la description de produit!",'Général', {timeOut: 5000 });
    }
    if ( this.productName.length > 0 && this.htmlContent.length > 0) 
    return true;

    return false;
  }

  checkPriceSection():boolean{
    let qteDiscountError:boolean = false;
    let qteNull:boolean = false;
    let reductionDiscountError:boolean = false;


    if (this.buyPrice == null || this.buyPrice == 0){
      this.toastr.error("Vérifiez le prix d'achat de produit!",'Prix', {timeOut: 5000 });
    }
    if (this.sellPrice == null || this.sellPrice == 0){
      this.toastr.error("Vérifiez le prix du vente de produit!",'Prix', {timeOut: 5000 });
    }
    // checking discount table
    if (this.discountTable.length > 0){
      //quantity null
      this.discountTable.forEach((row:any) =>{
        if (row.qte == null || row.qte === undefined){
          qteNull = true;
        }
      });

      if (!qteNull){
            //quantity equqlity
            for (let i = 0; i < this.discountTable.length; i++) {
              for (let j = i + 1; j < this.discountTable.length; j++) {
                if (this.discountTable[i].qte == this.discountTable[j].qte) {
                  qteDiscountError = true;
                }
              }
            }
      }
      //reduction value
      this.discountTable.forEach((row:any) =>{
        if (row.reduction <= 0){
          reductionDiscountError = true;
        }
      });
      
    }

    if (qteNull){
      this.toastr.error("Il est impératif d'ajouter une quantité dans la formule de réduction.",'Réduction par formules', {timeOut: 5000 });
    }

    if (qteDiscountError == true){
      this.toastr.error("Vous ne pouvez pas ajouter deux lignes avec la même quantité.",'Réduction par formules', {timeOut: 5000 });
    }

    if (reductionDiscountError){
      this.toastr.error("Vous ne pouvez pas ajouter une formule avec une valeur de réduction nulle ou négative.",'Réduction par formules', {timeOut: 5000 });
    }

    if ( ((this.buyPrice != null && this.buyPrice > 0) && (this.sellPrice != null && this.sellPrice > 0)) && ((qteDiscountError == false && reductionDiscountError == false)) && (qteNull == false ))
      return true;

      
    return false;
  }

  checkCategorySection():boolean{
    if (this.listProductCategories == null){
      this.toastr.error("Vous devez ajouter une catégorie dans le module Collections (la liste des catégories est vide !)",'Catégories', {timeOut: 5000 });
    }
    if (this.listProductCategories != null && this.parentCat == null) {
      this.toastr.error("Sélectionner une catégorie!",'Catégories', {timeOut: 5000 });
    }
    if ( (this.listProductCategories != null && this.parentCat != null) && (this.subCategoryList != null && this.subCat == null)){
      this.toastr.error("Vous devez sélectionner une sous-catégorie!",'Catégories', {timeOut: 5000 });
    }
    if (this.parentCat != null && this.subCat == null){
      this.productCategoryID = this.parentCat.id;
    }
    if (this.parentCat != null && this.subCat != null){
      this.productCategoryID = this.subCat.id;
    }
    if ((this.parentCat != null && this.subCategoryList == null) || (this.subCat != null && this.subCategoryList != null)) {
      return true;
    }

    return false;
  }

  checkStockSection():boolean{
    let stockErr:boolean = false;
    let priceErr:boolean = false;
    let defaultVariantErr:boolean = true;
    
    if (this.filesSize == 0 && this.stockPrincipal > 0){
      this.toastr.error("Il est impératif d'ajouter des images principales au produit avant d'ajouter une quantité en stock!",'Stock', {timeOut: 5000 });
    }
    /*
    if (this.filesSize > 0 && (this.stockPrincipal == 0 || this.stockPrincipal == null)){
      this.toastr.error("Il est impératif d'ajouter une quantité en stock!",'Stock', {timeOut: 5000 });
    } */
    if ( (this.filesSize == 0 && (this.stockPrincipal == 0 || this.stockPrincipal == null)) && (this.variantsTable == null || this.variantsTable.length == 0)){
      this.toastr.error("En l'absence d'un produit principal comportant des images et une quantité en stock, il est nécessaire d'ajouter des variantes!",'Erreur', {timeOut: 6000 });
    }
    // check stock value of each variant when principal product didnt exist !
    //this.filesSize == 0 changed to this.filesSize >= 0
    if ( (this.filesSize >= 0 && (this.stockPrincipal == 0 || this.stockPrincipal == null)) && (this.variantsTable != null || this.variantsTable.length > 0)){
      this.variantsTable.forEach((item:any) => {
        // if default image selected set
        if (item.stock == null || item.stock === undefined){
          stockErr=true;
        }
        if (item.price == null || item.price === undefined){
          priceErr=true;
        }
        if (item.defaultVariant == true){
          defaultVariantErr=false;
        }
      });
      if (stockErr){
        this.toastr.error("Veuillez vérifier le champ de valeur du stock des variantes du produit, elle ne doit pas être vide.",'Variants', {timeOut: 6000 });
      }
      if (priceErr){
        this.toastr.error("Veuillez vérifier le champ de valeur du prix des variantes du produit, elle ne doit pas être vide.",'Variants', {timeOut: 6000 });
      }
      if (defaultVariantErr){
        this.toastr.error("En l'absence d'un produit principal, il convient de sélectionner une variante par défaut.",'Variants', {timeOut: 6000 });
      }
    }
    if (this.filesSize > 0 && this.stockPrincipal >= 0){
      this.saveImagesPositions();
    }
    else{
      this.imagesToUpload = [];
    }
    if ( ((this.filesSize > 0 && this.stockPrincipal > 0) && (this.variantsTable == null || this.variantsTable.length == 0)) || ( ((this.filesSize >= 0 && (this.stockPrincipal == null || this.stockPrincipal == 0)) && (this.variantsTable !=null || this.variantsTable.length > 0)) && ((!stockErr && !priceErr) &&  !defaultVariantErr) )){
      if (this.variantsTable.length > 0){
          this.variantsImages = [];
          this.variantData = [];
          this.convertBase64ToFiles(this.variantsTable);
      }
      return true;
    }

    return false;
  }

  checkShippingPriceSection():boolean{
    if (this.shippingPrice != null && this.shippingPrice < 0){
      this.toastr.error("Les frais de livraison doivent être d'au moins 0!",'Frais de livraison', {timeOut: 6000 });
    }
    if ((this.shippingPrice == null ) || (this.shippingPrice != null && this.shippingPrice >=0))
    return true;

    return false;
  }

  checkVisitorsRangeSection():boolean{
    if (this.startRange != null && this.startRange < 0){
      this.toastr.error("Début de gamme doit avoir une valeur supérieure ou égale à 0.",'Nombre de visiteurs live', {timeOut: 5000 });
    }
    if (this.endRange != null && this.endRange < 0){
      this.toastr.error("Fin de gamme doit avoir une valeur supérieure ou égale à 0.",'Nombre de visiteurs live', {timeOut: 5000 });
    }
    if (this.endRange < this.startRange){
      this.toastr.error("Fin de gamme doit avoir une valeur strictement supérieure à la valeur de début de gamme.",'Nombre de visiteurs live', {timeOut: 5000 });
    }
    if ((this.startRange != null && this.endRange !=null) && (this.startRange == 0 && this.endRange == 0)){
      this.toastr.error("Debut de gamme et fin de gamme doit avoir une valeur strictement supérieure a 0.",'Nombre de visiteurs live', {timeOut: 5000 });
    }
    if ( (this.startRange == null && this.endRange == null ) || ( ( (this.startRange != null && this.endRange != null ) && (this.startRange >= 0 && this.endRange >= 0)) && (this.startRange < this.endRange)))
      return true;

    return false;
  }

  checkTimerSection():boolean{
    if (this.nbHours < 0){
      this.toastr.error("Nombre de minutes doit avoir une valeur supérieure ou égale à 0.",'Compte à rebours', {timeOut: 5000 });
    }
    if (this.nbHours == null || this.nbHours >= 0)
      return true;

    return false;
  }
  // end section verification

  generateNow() {
    if (this.selectedElements != null){
      this.saveImagesPositions();
      // there are variants generated!
      this.isVariantsGenerated = true;
      // init default variant
      this.defaultVariant = null;
      // Initialize the attributesMap
      this.attributesMap = {};
      this.variantsTable = [];

      this.selectedElements.forEach((element: string) => {
        const attribute = this.getAttributeForElement(element);

        if (!this.attributesMap[attribute]) {
          this.attributesMap[attribute] = [];
        }

        this.attributesMap[attribute].push(element);
      });
      this.generatedVariants = this.generateCombinations(this.attributesMap);
      console.log(this.generatedVariants);
      // init variantTable
      for (let i=0;i<this.generatedVariants.length;i++){
        this.variantsTable.push({
          attributes: this.generatedVariants[i],
          stock: this.stockPrincipal,
          price: this.sellPrice,
          defaultVariant: false,
          actif: true,
        });
      }
      //end init variant table
      // init toogle value variant by default = false
      this.initializeToggleValues(this.generatedVariants.length);


      if (this.filesSize == 0){
        this.selectedImages = null;
      }
      if (this.selectedImages != null){
         this.loadDefaultVariantImage();
      }
      else if (this.selectedImages == null || this.filesSize == 0){
        this.variantsTable.forEach((row:any)=> {
            row.image = null;
        });
      }
      this.showVariantsTable = true;

    }
    else{
      this.toastr.error("Vous devez sélectionner des éléments pour pouvoir générer des variantes de produit!", 'Opération échouée', {timeOut: 5000 });
      
    }
  }

  initializeToggleValues(rowCount: number) {
    this.toggleValues = Array(rowCount).fill(false);
  }

 // Function to handle row selection and update toggleValues
 toggleRow(index: number, row: any) {
  // Set the currently selected row to true
  this.toggleValues[index] = row.defaultVariant;

  // Deselect all other rows and set their defaultVariant to false
  this.variantsTable.forEach((otherRow:any, i:any) => {
    if (i !== index) {
      this.toggleValues[i] = false;
      otherRow.defaultVariant = false;
    }
  });

  // Update the selected row index
  this.selectedRowIndex = this.toggleValues[index] ? index : undefined;
}


  loadDefaultVariantImage() {
    if (this.variantsTable.length > 0){
      this.imagesToUpload = [];
      this.saveImagesPositions();
      // Replace this with your actual File object
      const file = this.selectedImages[this.imageOrder[0]];

      const reader = new FileReader();

      reader.onload = (event) => {
        this.variantsTable.forEach((item:any) => {
          item.image = event.target?.result || '';
        });
      };

      reader.readAsDataURL(file);
    }
  }

  generateCombinations(attributesMap: { [key: string]: string[] }) {
    const attributeNames = Object.keys(attributesMap);
  
    function generateCombinationsRec(index: number): string[][] {
      if (index === attributeNames.length) {
        return [[]];
      }
  
      const attributeName = attributeNames[index];
      const elements = attributesMap[attributeName];
      const combinations = generateCombinationsRec(index + 1);
      const newCombinations: string[][] = [];
  
      for (const element of elements) {
        for (const combination of combinations) {
          if (!combination.includes(element)) {
            newCombinations.push([element, ...combination]);
          }
        }
      }
  
      return newCombinations;
    }
  
    const combinations = generateCombinationsRec(0);
    return combinations.filter(combination => combination.length > 0);
  }

  getAttributeForElement(element: string): string {
    
    for (const attribute of this.attributesList) {
      for (const elm of attribute.elements) {
        if (element === elm.name) {
          return attribute.name;
        }
      }
    }
  
    return ''; 
  }
  
 
  loadAllAttributes(){
    this.attributeService.loadAllAttributes().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.attributesList = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.attributesList = null;
        }
        else {
          this.attributesList = res;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.attributesList = null;
      }
       
    });
  }

  loadProductsCategories(){
    this.productCategoryService.loadAllProductCategories().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.listProductCategories = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.listProductCategories = null;
        }
        else {
          this.listProductCategories = res;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.listProductCategories = null;
      }
    });
  }

  onDragStart(event: DragEvent, index: number) {
    if (event.dataTransfer) {
      this.draggedIndex = index;
      event.dataTransfer.setData("text/plain", index.toString());
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  
onDrop(event: DragEvent, dropIndex: number) {
  event.preventDefault();
  if (this.draggedIndex !== null && dropIndex !== this.draggedIndex) {
    // Reorder the image previews based on drag-and-drop
    const draggedImage = this.imagePreviews[this.draggedIndex];
    this.imagePreviews.splice(this.draggedIndex, 1);
    this.imagePreviews.splice(dropIndex, 0, draggedImage);

    // Reorder the image order based on the new order
    const movedOrder = this.imageOrder[this.draggedIndex];
    this.imageOrder.splice(this.draggedIndex, 1);
    this.imageOrder.splice(dropIndex, 0, movedOrder);
  }
  this.draggedIndex = null;
  this.saveImagesPositions();
  if (this.variantsTable.length > 0 ){
    this.loadDefaultVariantImage();
  }
}
  
  

saveImagesPositions() {
  this.imagesToUpload = [];

  for (let i = 0; i < this.imagePreviews.length; i++) {
    const file = this.selectedImages[this.imageOrder[i]];
    const position = i;

    //console.log(`File at position ${position}:`, file);

    this.imagesToUpload.push(file);  

  }

}
  
  


  selectFiles(evt: any) {
    const files: FileList = evt.target.files;
    this.filesSize = files.length;
  
    if (files.length > 0) {
      this.selectedImages = [];
      this.imagePreviews = [];
      const promises = [];
      let validFilesCount = 0; // Initialize count of valid files
  
      for (let i = 0; i < files.length; i++) {
        const imageFile = files[i];
       // console.log(imageFile);
  
        const promise = new Promise<void>((resolve) => {
          this.adminService.checkRealImage(imageFile).subscribe(
            (res: any) => {
              if (res.message === "Merci! Sauvegarder maintenant.") {
                this.filesSelected = true;
                this.isRealImage = true;
                this.selectPhoto = 1;
                this.errorPreviewImage = res.message;
                this.selectedImages.push(imageFile);
                validFilesCount++; // Increment count of valid files
              } else {
               // console.log(`File skipped: ${imageFile.name}`);
              }
              resolve(); // Resolve the promise without a value
            },
            (error) => {
              if (error.status === 400) {
                console.log("error " + imageFile.name);
              }
              console.error(error);
              this.isRealImage = false;
              this.selectPhoto = 0;
              this.errorPreviewImage = error.error.message;
              resolve(); // Resolve the promise without a value
            }
          );
        });
  
        promises.push(promise);
      }
  
      Promise.all(promises).then(() => {
        this.filesSize = validFilesCount; // Update filesSize with the count of valid files
        this.fileInputLabel = this.filesSize + " fichier(s) sélectionné(s)";
        this.loadImagePreviews();
        if (this.variantsTable.length > 0 ){
          this.imageOrder = [];
          this.imagesToUpload = [];
          this.loadDefaultVariantImage();
        }
      });
    } else {
      this.fileInputLabel = "Importer des images";
    }
  }
  
  
  loadImagePreviews() {
    this.imagePreviews = [];
    this.imageOrder = []; //
    this.selectedImages.forEach((imageFile: File, index:number) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
  
        // Initialize image order based on the array index
        this.imageOrder.push(index);
      };
      reader.readAsDataURL(imageFile);
    });
  }
  
  
  

  deleteImage(index: number) {
    // Revoke the URL to release the resources
    URL.revokeObjectURL(this.imagePreviews[index]);
    this.imagePreviews.splice(index, 1);
    this.selectedImages.splice(index, 1);
    if (this.filesSize > 1){
      this.filesSize--;
      this.imagesToUpload = [];
      this.fileInputLabel =  this.filesSize+" fichier(s) sélectionné(s)";
    }
    else if (this.filesSize == 1){
      this.filesSelected = false;
      this.filesSize--;
      this.imagesToUpload = [];
      if (this.variantsTable.length > 0){
        this.variantsTable.forEach((item:any) => {
          item.image = null;
        });
      }
      this.fileInputLabel = "Importer des images";
    }
    else {
      this.filesSelected = false;
      this.imagesToUpload = [];
      if (this.variantsTable.length > 0){
        this.variantsTable.forEach((item:any) => {
          item.image = null;
        });
      }
      this.fileInputLabel = "Importer des images";
    }
    this.loadDefaultVariantImage();

    
  }
  
  getParentCategoryByName(name: string) {
      this.productCategoryService.loadAllProductCategories().subscribe((res:any) => {
        if (res != null){
          if (res.status === 204){
            console.log("response is 204");
            this.listProductCategories = null;
          }
          else if (res.status === 500){
            console.log("response is 500");
            this.listProductCategories = null;
          }
          else {
            this.listProductCategories = res;
            this.listProductCategories.forEach((category:any) => {
              if (category.categoryParent == 'null' && category.name == name)
              this.parentCat = category;
              this.onSelectedParentCategory(this.parentCat);
            });
          }
        }
        else {
          console.log("Response is null or undefined");
          this.listProductCategories = null;
        }
      });
  }

  getSubCategoryFromParent(parent: string): any[] {
    return this.listProductCategories.filter((category:any) => category.categoryParent === parent);
  }
  

  onSelectedParentCategory(category: any): void {
    this.parentCat = category;
    console.log("parent cat ="+this.parentCat.name);
    this.subCategoryList = []; // Clear the previous elements

    this.subCategoryList = this.getSubCategoryFromParent(category.name);
    if (this.subCategoryList.length === 0) {
      this.subCategoryList = null;
    } else {
      console.log("Subcategories: ", this.subCategoryList);
    }
  }


  addToDiscountTable() {
    if (this.sellPrice != null && this.sellPrice){
      this.discountTable.push({
        qte: 2,
        type: 'fixed',
        reduction: 0,
        finalPrice: this.sellPrice,
      });
    }
    else {
      this.toastr.error("Vous devez entrer le prix du vente de votre produit!", 'Opération échouée', {timeOut: 5000 });
    }
  }

  enforceValueRange(row: any) {
    if (row.reduction < 0) {
      row.reduction = 0;
    }
    if (row.type == "fixed"){
      if (row.reduction > this.sellPrice) {
        row.reduction = this.sellPrice;
        row.finalPrice = this.sellPrice - row.reduction;
      }
      else {
        row.finalPrice = this.sellPrice - row.reduction;
      }
    }
    if (row.type == "percent") {
      if (row.reduction > 100) {
        row.reduction = 100;
        row.finalPrice = this.sellPrice - ((this.sellPrice * row.reduction) / 100);
      }
      else {
        row.finalPrice = this.sellPrice - ((this.sellPrice * row.reduction) / 100);
      }
    }  
  
  }

  onSelectedComplexReductionType(row:any){
    if (row.type == "fixed"){
      if (row.reduction != null){
        row.finalPrice = this.sellPrice - row.reduction;
      }
    }
    if (row.type == "percent"){
      if (row.reduction != null){
        row.finalPrice = this.sellPrice - ((this.sellPrice * row.reduction) / 100);
      }
    }
  }

  enforcePositiveQte(row: any){
    const qteAsString = row.qte.toString(); // Convert the number to a string
    if (row.qte < 2 && qteAsString.length > 0) {
      row.qte = 2;
    }
  }

  enforcePositiveStockPrincipal(){
    const stockAsString = this.stockPrincipal.toString(); // Convert the number to a string
    if (this.stockPrincipal < 0 && stockAsString.length > 0) {
      this.stockPrincipal = 0;
    }
  }

  enforcePositiveStockVariant(row:any){
    const stockAsString = row.stock.toString(); // Convert the number to a string
    if (row.stock < 0 && stockAsString.length > 0) {
      row.stock = 0;
    }
  }

  enforcePositivePriceVariant(row:any){
    const priceAsString = row.price.toString(); // Convert the number to a string
    if (row.price < 0 && priceAsString.length > 0) {
      row.price = 0;
    }
  }

  enforcePositiveShippingPrice(){
    const shippingPriceAsString = this.shippingPrice.toString(); // Convert the number to a string
    if (this.shippingPrice < 0 && shippingPriceAsString.length > 0) {
      this.shippingPrice = 0;
    }
  }

  deleteRow(row:any) {
    const index = this.discountTable.indexOf(row);
    if (index !== -1) {
      this.discountTable.splice(index, 1);
    }
  }

  deleteRowVariant(row:any) {
    const index = this.variantsTable.indexOf(row);
    if (index !== -1) {
      this.variantsTable.splice(index, 1);
      if(this.variantsTable.length == 0){
        this.isVariantsGenerated = false;
      }
    }
  }

  onSelectedStatus(value:string): void {
    this.productStatus = value;
    console.log("Status = "+ this.productStatus);
  }

  onSelectedReductionType(value:string): void {
    this.simpleReductionType = value;
    console.log("Reduction Type = "+ this.simpleReductionType);
  }

  onSelectedTax(value:string): void {
    this.tax = value;
    console.log("Reduction Type = "+ this.tax);
  }

  handleImageUpload(event: any, row: any) {
    const file = event.target.files[0]; // Get the uploaded image file
    if (file) {
      this.adminService.checkRealImage(file).subscribe((res: any) => {
      if (res.message === "Merci! Sauvegarder maintenant.") {
          const reader = new FileReader();
            reader.onload = (e: any) => {
              row.image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
      },
        (error) => {
          if (error.status === 400) {
            this.toastr.error("Format de fichier invalide. Seuls les fichiers image sont autorisés.", 'Opération échouée', {timeOut: 5000 });
          }
        }
      );        
      }
  }  

  enforcePositiveBuyPrice(){
    const buyPriceAsString = this.buyPrice.toString(); // Convert the number to a string
    if (this.buyPrice < 0 && buyPriceAsString.length > 0) {
      this.buyPrice = 0;
    }
  }

  enforcePositiveSellPrice(){
    const sellPriceAsString = this.sellPrice.toString(); // Convert the number to a string
    if (this.sellPrice < 0 && sellPriceAsString.length > 0) {
      this.sellPrice = 0;
    }
  }

  enforcePositiveSimpleReductionValue(){
    const simpleReductionValueAsString = this.simpleReductionValue.toString(); // Convert the number to a string
    if (this.simpleReductionValue < 0 && simpleReductionValueAsString.length > 0) {
      this.simpleReductionValue = 0;
    }
    if (this.simpleReductionType == 'fixed'){
      if ( this.simpleReductionValue > this.sellPrice){
        this.simpleReductionValue = this.sellPrice;
      }
    }
    if (this.simpleReductionType == 'percent'){
      if ( this.simpleReductionValue > 100){
        this.simpleReductionValue = 100;
      }
    }
  }

  enforceStartVisitorRange(){
    const startRangeAsString = this.startRange.toString(); // Convert the number to a string
    if (this.startRange < 0 && startRangeAsString.length > 0) {
      this.startRange = 0;
    }
  }

  enforceEndVisitorRange(){
    const endRangeAsString = this.endRange.toString(); // Convert the number to a string
    if (this.endRange < 0 && endRangeAsString.length > 0) {
      this.endRange = 0;
    }
  }

  enforcePositiveTimer(){
    const nbHoursAsString = this.nbHours.toString(); // Convert the number to a string
    if (this.nbHours < 0 && nbHoursAsString.length > 0) {
      this.nbHours = 0;
    }
  }
  
}
function checkvariantsUpdate() {
  throw new Error('Function not implemented.');
}

