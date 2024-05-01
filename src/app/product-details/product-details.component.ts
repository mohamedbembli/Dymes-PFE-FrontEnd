import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import SwiperCore , {Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller} from 'swiper';
import { map, takeWhile, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FastCheckoutDialogComponent } from '../fast-checkout-dialog/fast-checkout-dialog.component';
import { AddRatingDialogComponent } from '../add-rating-dialog/add-rating-dialog.component';



// Install Swiper modules
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);




@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('navSwiper') navSwiper!: SwiperComponent;
  @ViewChild(SwiperComponent) swiper?: SwiperComponent;

  isMobileMenuOpen: boolean = false;
  product:any;
  previewSwiperConfig:any;

  responsiveOptions:any;
  imagesProductList: any[] = [];

  elementsByAttributeList:any = [];
  groupedElements: { [key: string]: any[] } = {};

  userSelectedValues: { [key: string]: string[] } = {};
  principalImage:any=null;
  
  randomValueVisitors:any;
  countdown:any;
  countdownValue: string = '';

  productsList:any=null;
  favoritesList:any = [];
  countFavoriteProducts:number=0;

  errorMSG: string | null = null;
  successMSG: string | null = null;


  quantity:number =1;

  variantToBasket:any=null;
  basketProducts: any[] = [];
  basketItemCount: number = 0; // Initialize a variable to count items in the basket

  itemFastCheckout: any[] = [];
  variantToFastCheckout:any=null;

  isRatingActive: boolean = false;
  ratingList:any=[];



     // Add rating Dialog
     openAddRatingDialog(): void {
      const dialogRef = this.dialog.open(AddRatingDialogComponent, {
        data: {
          productID: this.product.id
        }
      });
      dialogRef.afterClosed().subscribe(async () => {
        if (dialogRef.componentInstance.ratingSent){
          console.log("data correct");
          this.showSuccessMessage("Merci pour votre Avis!");
          dialogRef.close();
          
  
        }
        else {
          console.log("data incorrect");
  
        }
     });
    }
    // END add rating Dialog

   // Add attribute Dialog
   openFastCheckoutDialog(): void {
    const dialogRef = this.dialog.open(FastCheckoutDialogComponent, {
      width: '480px',
      height:'650px',
      data: {
        itemFastCheckout: this.itemFastCheckout
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.paymentDone){
        console.log("data correct");
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END add attribute Dialog


  public navSwiperConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 4,
    spaceBetween: 10,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  };

  calculateRemainingTime(targetTime: Date): string {
    const currentTime = new Date();
    const difference = targetTime.getTime() - currentTime.getTime();
  
    if (difference <= 0) {
      return '00:00:00:00';
    }
  
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    return `${this.padNumber(days)}:${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }
  
  ngAfterViewInit(): void {
    if (this.product.productImages.length > 0) {
          this.previewSwiperConfig = {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 10,
            server: true,
            observeParents: true,
            thumbs: {
              swiper: this.navSwiper?.swiperRef,
            },
          }
    }
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  fastCheckout(){
    if (this.quantity <= 0 ){
      this.showErrorMessage("La quantité doit être supérieure à 0 !");
    }
    else{
      let allOkay=true;
      const userSelectedValuesLength: number = Object.keys(this.userSelectedValues).length;
      console.log('Length of userSelectedValues:', userSelectedValuesLength);
      
      if (this.product.variants.length > 0) {
        if (userSelectedValuesLength !== 0 && userSelectedValuesLength == this.elementsByAttributeList.length) {
          // check quantity
          this.variantToFastCheckout = this.getMatchingVariant()[0];
          if (!this.variantToFastCheckout.actif) {
            this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, n'est pas disponible actuellement !");
            allOkay = false;
          } else {
            console.log("match variantToFastCheckout is = " + JSON.stringify(this.variantToFastCheckout));
            if (this.variantToFastCheckout.stock === 0) {
              this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
              allOkay = false;
            } else if (this.variantToFastCheckout.stock < this.quantity) {
              this.showErrorMessage("Il y a seulement " + this.variantToFastCheckout.stock + " pièces dans cette variante!");
              allOkay = false;
            } else {
                this.itemFastCheckout[0] = []; // empty it
                this.itemFastCheckout[0].push({
                  type: "variant",
                  product: this.product,
                  obj: this.variantToFastCheckout,
                  qte: this.quantity
                });
                allOkay = true;
            }
          }
        } else {
          this.showErrorMessage("Veuillez sélectionner les caractéristiques de votre produit avant d'ajouter au panier !");
          allOkay = false;
        }
      } else {
        // there are no variants in the product
        if (this.product.stock === 0) {
          this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
          allOkay = false;
        } else if (this.product.stock < this.quantity) {
          this.showErrorMessage("Il y a seulement " + this.product.stock + " pièces dans ce produit!");
          allOkay = false;
        } else {
           this.itemFastCheckout[0] = []; // empty it
            this.itemFastCheckout[0].push({
              type: "product",
              obj: this.product,
              qte: this.quantity
            });
            allOkay = true;
        }
      }
      if (allOkay){
        this.openFastCheckoutDialog();
      }
    }
  }

  initializeComponent(){
    console.log("Entered in initializeComponent");
 
     this.route.params.subscribe(params => {
       const id = params['id'];
       console.log("the new param ID = "+id);
       this.authService.getProduct(id).subscribe((res: any) => {
             //init
            this.imagesProductList = [];
            this.product = null;
            this.principalImage = null;
            this.elementsByAttributeList = [];
            this.groupedElements = {};
            this.userSelectedValues = {};
            this.quantity =1;
            this.variantToBasket =null;
            this.basketProducts = [];
            this.basketItemCount = 0;
           if (res == null){
             this.router.navigate(['/']);
           } else {
             this.product = res;
             //rating
             if (this.product.ratings.length > 0 ){
              this.getAllRating(id); // getRating
             }
             this.getAllProductImages();
             this.goupVariantsByAttribute();
             this.loadProducts();
             this.basketItemCount = parseInt(localStorage.getItem('basketItemCount') || '0', 10);
             // favorites list
            const favoritesVisitorString = localStorage.getItem("favoritesVisitor");
            if (favoritesVisitorString !== null) {
              // Parse the stored JSON string to get the array
              this.favoritesList = JSON.parse(favoritesVisitorString);
            }
            //
 
             if (this.product.visitorsRange != null){
                // Create an Observable that emits a random number between rangeFrom and rangeTo every second
                 this.randomValueVisitors = timer(0, 1000).pipe(
                   map(() => this.getRandomNumberInRange(this.product.visitorsRange.rangeFrom, this.product.visitorsRange.rangeTo))
                 );
             }
             //timer
             if (this.product.timer != null){
               // Calculate the target time by adding nbHours to the current time
               const targetTime = new Date();
               targetTime.setHours(targetTime.getHours() + this.product.timer.nbHours);
 
               // Create an Observable that emits the remaining time every second
               this.countdown = timer(0, 1000).pipe(
                 map(() => this.calculateRemainingTime(targetTime)),
                 takeWhile(value => value !== '00:00:00:00') // Stop when the remaining time is zero
               ).subscribe(value => {
                 this.countdownValue = value;
               });
             }
             //dicounts
             if (this.product.discounts != null){
               this.product.discounts.sort((a:any, b:any) => a.quantity - b.quantity);
             }
           }
         },
         (error) => {
           // Handle errors
           console.error(error);
           this.router.navigate(['/']);
         }
       );
     });
 
     //
     this.responsiveOptions = [
       {
           breakpoint: '1024px',
           numVisible: 3,
           numScroll: 3
       },
       {
           breakpoint: '768px',
           numVisible: 2,
           numScroll: 2
       },
       {
           breakpoint: '560px',
           numVisible: 1,
           numScroll: 1
       }
   ];
  }


  increaseQte(){
    this.quantity++;
  }

  decreaseQte(){
    if (this.quantity > 1){
      this.quantity --;
    }
  }

  onQuantityChange(event: any) {
    // Update the quantity when the input changes
    this.quantity = parseInt(event.target.value, 10);
  }


  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 8000);
  }

  closeError() {
    this.errorMSG = null;
  }

  checkProductAvaibility() {
    let allOkay: any = true;
    this.basketProducts = JSON.parse(localStorage.getItem('basketProducts') || '[]') as string[];
    
    const userSelectedValuesLength: number = Object.keys(this.userSelectedValues).length;
    console.log('Length of userSelectedValues:', userSelectedValuesLength);
    
    if (this.product.variants.length > 0) {
      if (userSelectedValuesLength !== 0 && userSelectedValuesLength == this.elementsByAttributeList.length) {
        // check quantity
        this.variantToBasket = this.getMatchingVariant()[0];
        if (!this.variantToBasket.actif) {
          allOkay = false;
          this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, n'est pas disponible actuellement !");
        } else {
          console.log("match variant is = " + JSON.stringify(this.variantToBasket));
          if (this.variantToBasket.stock === 0) {
            allOkay = false;
            this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
          } else if (this.variantToBasket.stock < this.quantity) {
            allOkay = false;
            this.showErrorMessage("Il y a seulement " + this.variantToBasket.stock + " pièces dans cette variante!");
          } else {
            // Check if the variant with the same ID exists in basketProducts
            const existingIndex = this.basketProducts.findIndex((item:any) => item.type === "variant" && item.obj.id === this.variantToBasket.id);
  
            if (existingIndex !== -1) {
              if ( this.basketProducts[existingIndex].qte + this.quantity > this.variantToBasket.stock){
                if (this.basketProducts[existingIndex].qte  == this.variantToBasket.stock){
                  this.showErrorMessage("Il y a que " + this.variantToBasket.stock + " pièces disponibles dans cette variante.");
                  allOkay = false;
                }
                if (this.basketProducts[existingIndex].qte < this.variantToBasket.stock) {
                  const remainingStock = this.variantToBasket.stock - this.basketProducts[existingIndex].qte;
                  this.quantity = remainingStock;
                  this.showErrorMessage("Il y a seulement " + this.variantToBasket.stock + " pièces disponibles dans cette variante. Nous avons ajouté à votre panier seulement " + remainingStock + " pièce(s) supplémentaires.");
                  // add remainingStock 
                  this.basketProducts[existingIndex].qte += remainingStock;
                  console.log("basketProducts = "+JSON.stringify(this.basketProducts));
                  allOkay = true;
                }            
              }
              else{
              // Product with the same ID exists, update its quantity
              this.basketProducts[existingIndex].qte += this.quantity;
              console.log("basketProducts = "+JSON.stringify(this.basketProducts));
              allOkay = true;
              }
    
            } else {
              // Variant with the same ID doesn't exist, add a new entry
              this.basketProducts.push({
                type: "variant",
                product: this.product,
                obj: this.variantToBasket,
                qte: this.quantity
              });
            }
  
            allOkay = true;
          }
        }
      } else {
        allOkay = false;
        this.showErrorMessage("Veuillez sélectionner les caractéristiques de votre produit avant d'ajouter au panier !");
      }
    } else {
      // there are no variants in the product
      if (this.product.stock === 0) {
        allOkay = false;
        this.showErrorMessage("Ce produit, doté de caractéristiques spécifiques, est actuellement en rupture de stock!");
      } else if (this.product.stock < this.quantity) {
        allOkay = false;
        this.showErrorMessage("Il y a seulement " + this.product.stock + " pièces dans ce produit!");
      } else {
        // Check if the product with the same ID exists in basketProducts
        const existingIndex = this.basketProducts.findIndex((item:any) => item.type === "product" && item.obj.id === this.product.id);
        console.log("existingIndex product = "+existingIndex);
        if (existingIndex !== -1) {
          if ( this.basketProducts[existingIndex].qte + this.quantity > this.product.stock){
            if (this.basketProducts[existingIndex].qte  == this.product.stock){
              this.showErrorMessage("Il y a que " + this.product.stock + " pièces disponibles dans ce produit.");
              allOkay = false;
            }
            if (this.basketProducts[existingIndex].qte < this.product.stock) {
              const remainingStock = this.product.stock - this.basketProducts[existingIndex].qte;
              this.quantity = remainingStock;
              this.showErrorMessage("Il y a seulement " + this.product.stock + " pièces disponibles dans ce produit. Nous avons ajouté à votre panier seulement " + remainingStock + " pièce(s) supplémentaires.");
              // add remainingStock 
              this.basketProducts[existingIndex].qte += remainingStock;
              console.log("basketProducts = "+JSON.stringify(this.basketProducts));
              allOkay = true;
            }            
          }
          else{
          // Product with the same ID exists, update its quantity
          this.basketProducts[existingIndex].qte += this.quantity;
          console.log("basketProducts = "+JSON.stringify(this.basketProducts));
          allOkay = true;
          }

        } else {
          // Product with the same ID doesn't exist, add a new entry
          this.basketProducts.push({
            type: "product",
            obj: this.product,
            qte: this.quantity
          });
          allOkay = true;

        }
  
      }
    }
  
    return allOkay;
  }
  
  
  addToBasket() {
    console.log("this.quantity = " + this.quantity);
    
    if (this.quantity > 0) {
      const available = this.checkProductAvaibility();
      console.log("available = " + available);
  
      if (available) {
        // Add the selected variants to localStorage
        localStorage.setItem('basketProducts', JSON.stringify(this.basketProducts));
  
        // Update the basket item count and quantity
        this.basketItemCount += this.quantity;
        localStorage.setItem('basketItemCount', this.basketItemCount.toString());
  
        // You may want to reset the selected variants array after adding them to the basket
        this.basketProducts = [];
        
        // Redirect to the 'cart' route
        this.router.navigate(['/cart']);
      }
    } else {
      this.showErrorMessage("S'il vous plaît, veuillez saisir une quantité de produit supérieure à zéro");
    }
  }
  
  
  

  getMatchingVariant(): any {
    return this.product.variants.filter((variant:any) => {
      return Object.keys(this.userSelectedValues).every((attributeId) => {
        const selectedValues = this.userSelectedValues[attributeId];
        const matchingElement = variant.elements.find((element:any) => {
          return (
            (element.attribute.id || element.attribute)  === parseInt(attributeId) && selectedValues.includes(element.name)
          );
        });
        return matchingElement !== undefined;
      });
    });
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  isFavorite(productId: number): boolean {
    // Check if favoritesList contains the product with the given ID
    return this.favoritesList.some((item:any) => item.id === productId);
  }

  toggleFavorite(product: any): void {
    const productIndex = this.favoritesList.findIndex((favProduct: any) => favProduct.id === product.id);

    if (productIndex !== -1) {
      // Product is in the favorites list, remove it
      this.favoritesList.splice(productIndex, 1);
      this.countFavoriteProducts--;

      console.log("Product removed from favorites list for the visitor.");
    } else {
      // Product is not in the favorites list, add it
      this.favoritesList.push(product);
      this.countFavoriteProducts++;

      console.log("Product added to favorites list for the visitor.");
    }
  }


  addProductToFavoriteList(product: any): void {

    // Get the current favorites list from local storage
    const favoritesVisitorString = localStorage.getItem("favoritesVisitor");

    if (favoritesVisitorString !== null) {
      // Parse the stored JSON string to get the array
      this.favoritesList = JSON.parse(favoritesVisitorString);

      // Toggle the product in and out of the favorites list
      this.toggleFavorite(product);

      // Save the updated favorites list to local storage
      localStorage.setItem("favoritesVisitor", JSON.stringify(this.favoritesList));
      localStorage.setItem("countFavoriteProducts", this.countFavoriteProducts.toString());
    } else {
      // If the favoritesVisitor key doesn't exist, create a new list
      this.favoritesList = [product];
      this.countFavoriteProducts++;
      localStorage.setItem("countFavoriteProducts", this.countFavoriteProducts.toString());

      // Save the favorites list to local storage
      localStorage.setItem("favoritesVisitor", JSON.stringify(this.favoritesList));

      console.log("Product added to a new favorites list for the visitor.");
    }
}

loadProducts() {
  this.productsList = null;
  this.authService.getProducts().subscribe((res: any) => {
      this.productsList = res.filter((product:any) => {
          return product.status === 'actif';
      });
  });
}

  onNextClick() {
    if (this.swiper) {
      this.swiper.swiperRef?.slideNext();
    }
  }
  
  onPrevClick() {
    if (this.swiper) {
      this.swiper.swiperRef?.slidePrev();
    }
  }  

  getTypeFromAttribute(id: any) {
    return this.elementsByAttributeList.find((attr: any) => attr.id === id);
  }

  onOptionSelected(attributeId: number, elementType: string, elementName: number, elementReference: string) {
    const key = `${attributeId}`;
  
    // Check if the key already exists
    if (!this.userSelectedValues[key]) {
      // If the key doesn't exist, initialize a new array
      this.userSelectedValues[key] = [];
    }
  
    // Add or update the selected value
    const selectedValue = `${elementName}`;
    const index = this.userSelectedValues[key].indexOf(selectedValue);
  
    if (index === -1) {
      // If the value doesn't exist, add it
      this.userSelectedValues[key] = [selectedValue];
  
      // check if variant is an image selected principalImage
      if (elementType == 'images') {
        this.principalImage = elementReference;
  
        // Move the selected image to the current position of imagesProductList
        this.moveSelectedImageToPosition();
      }
      if (elementType == 'colors'){
        this.showSelectedColorImage(elementReference);
      }
    } else {
      // If the value already exists, remove it (deselect)
      this.userSelectedValues[key].splice(index, 1);
  
      // Check if the array is empty and remove the key
      if (this.userSelectedValues[key].length === 0) {
        delete this.userSelectedValues[key];
        this.principalImage = null;
      }
    }
    // check if attributes num equals userSelectedValues key , update variant price
    const userSelectedValuesLength: number = Object.keys(this.userSelectedValues).length;
    if (userSelectedValuesLength !== 0 && userSelectedValuesLength == this.elementsByAttributeList.length) {
      this.variantToBasket = this.getMatchingVariant()[0];
    }
    console.log("userSelectedValues = " + JSON.stringify(this.userSelectedValues)); 
  
  }
  
  
  moveSelectedImageToPosition() {
    // Find the index of the selected image in the imagesProductList
    const selectedImageIndex = this.imagesProductList.findIndex(image => image.obj.id === this.principalImage);
  
    if (selectedImageIndex !== -1) {
      // Get the current active index of the Swiper
      const currentSwiperIndex = this.swiper?.swiperRef?.activeIndex ?? 0;
  
      // Remove the selected image from its current position
      const selectedImage = this.imagesProductList.splice(selectedImageIndex, 1)[0];
      
      // Add the selected image to the current Swiper position
      this.imagesProductList.splice(currentSwiperIndex-1, 0, selectedImage);
  
      // Trigger a Swiper update to reflect the changes
      this.swiper?.swiperRef?.update();
    }
  }

  showSelectedColorImage(colorRef: any) {
    // Find the index of the selected image in the imagesProductList
    const selectedImageIndex = this.imagesProductList.findIndex(image => {
      if (image.type === 'variant') {
        // Check if any element's reference matches the provided colorRef
        return image.obj.elements.some((element:any) => element.reference === colorRef);
      } else {
        return false; // Not a variant, skip
      }
    });
    
    if (selectedImageIndex !== -1) {
      // Get the current active index of the Swiper
      const currentSwiperIndex = this.swiper?.swiperRef?.activeIndex ?? 0;
  
      // Remove the selected image from its current position
      const selectedImage = this.imagesProductList.splice(selectedImageIndex, 1)[0];
  
      // Add the selected image to the current Swiper position
      this.imagesProductList.splice(currentSwiperIndex - 1, 0, selectedImage);
  
      // Trigger a Swiper update to reflect the changes
      this.swiper?.swiperRef?.update();
    }
  }
  
  
  
  
  
  
  restoreAllVariantImages() {
    this.imagesProductList = [];
    this.getAllProductImages();
  }
  

  
  isSelected(attributeId: number, elementType: string, elementName: string, elementReference: string): boolean {
    const key = `${attributeId}`;
    return this.userSelectedValues[key]?.includes(`${elementName}`) ?? false;
  }

      

  goupVariantsByAttribute() {
    if (this.product.variants.length > 0) {
      let uniqueAttributeIds = new Set<any>();
  
      this.product.variants.forEach((variant: any) => {
        variant.elements.forEach((element: any) => {
          if (element.attribute.id === undefined || element.attribute.id === null) {
            this.authService.getAttribute(element.attribute).subscribe((res: any) => {
              if (!uniqueAttributeIds.has(element.attribute)) {
                uniqueAttributeIds.add(element.attribute);
                this.elementsByAttributeList.push(res);
              }
            });
          } else {
            if (!uniqueAttributeIds.has(element.attribute.id)) {
              uniqueAttributeIds.add(element.attribute.id);
              this.elementsByAttributeList.push(element.attribute);
            }
          }
        });
      });
  
      console.log("elementsByAttributeList =", this.elementsByAttributeList);
  
      // now group elements by attribute
  
      this.product.variants.forEach((variant: any) => {
        if (variant.actif){
          variant.elements.forEach((element: any) => {
            const attributeId = element.attribute.id || element.attribute;
    
            if (!this.groupedElements[attributeId]) {
              this.groupedElements[attributeId] = [];
            }
    
            // Check if an element with the same name and reference is not already in the array
            if (!this.groupedElements[attributeId].some((e) => e.name === element.name && e.reference === element.reference)) {
              this.groupedElements[attributeId].push(element);
            }
          });
        }
      });
  
      console.log("New groupedElements =", this.groupedElements);
    }
  }
  
  
  
  

  getAllProductImages() {
    let i=0;
    // productImages
    if (this.product.productImages.length > 0) {
        const sortedImages = this.product.productImages.sort((a: any, b: any) => a.position - b.position);
        sortedImages.forEach((item: any) => {
            this.imagesProductList.push({ type: "productImage", obj: item , position:i});
            i++;
        });
    }

    // variants
    if (this.product.variants.length > 0) {
        const uniqueColorsForProduct = new Set<string>();

        this.product.variants.forEach((variant: any) => {
            variant.elements.forEach((element: any) => {
             
              if (element.attribute.id === undefined || element.attribute.id === null) {
                this.authService.getAttribute(element.attribute).subscribe((res:any) => {
                  if (res.type == 'colors' || res.type == 'images'){
                    if (!uniqueColorsForProduct.has(element.name)) {
                      this.imagesProductList.push({ type: "variant", obj: variant, position:i});
                      i++;
                      uniqueColorsForProduct.add(element.name);
                    }
                  }
                });
              }
                else{
                  if (element.attribute.type == 'colors' || element.attribute.type == 'images'){
                    if (!uniqueColorsForProduct.has(element.name)) {
                      this.imagesProductList.push({ type: "variant", obj: variant, position:i});
                      i++;
                      uniqueColorsForProduct.add(element.name);
                    }
                  }
                }
                
            });
        });
        

    }
}

  getProductCategoryImageUrl(categoryId: string): string {
    return `${this.authService.host}/public/getProductCategoryImage/${categoryId}`;
  }

  getProductImagePhotoUrl(productImageID: string): string {
    return `${this.authService.host}/public/productImage/${productImageID}`;
  }

  getProductPhotoUrl(productId: string): string {
    return `${this.authService.host}/public/product/${productId}`;
  }

  getVariantImage(variantId: string): string {
    return `${this.authService.host}/public/variant/${variantId}`;
  }


  toggleView(view: string) {
    this.isRatingActive = (view === 'rating');
  }

  showSuccessMessage(message: string) {
    this.successMSG = message;
    setTimeout(() => (this.successMSG = null), 3000);
  }

  closeSuccess() {
      this.successMSG = null;
  }

  getAllRating(productID:any){
    this.authService.loadRatings(productID).subscribe((res:any) => {
     
      if (res != null){
        if (res.status === 204){
         this.ratingList = null;
          console.log("response is 204");
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.ratingList = null;
        }
        else {
          this.ratingList = res;
          this.calculateAverageRating();
          this.ngAfterViewInit();
        }
      }
      else {
        console.log("Response is null or undefined");
      }
      
       
    });
}

calculateAverageRating(): number {
  if (this.ratingList.length === 0) {
      return 0; // Return 0 if there are no ratings
  }

  // Calculate the sum of all ratings
  const sumOfRatings = this.ratingList.reduce((acc:any, rating:any) => acc + rating.stars, 0);

  // Calculate the average rating
  const averageRating = sumOfRatings / this.ratingList.length;

  // Round the average rating to two decimal places
  return Math.round(averageRating * 100) / 100;
}
  


}
