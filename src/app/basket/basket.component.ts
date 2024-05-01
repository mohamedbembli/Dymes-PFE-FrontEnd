import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})


export class BasketComponent implements OnInit {

  isMobileMenuOpen: boolean = false;
  basketItemCount: number = 0; // Initialize a variable to count items in the basket
  productsList:any=null;

  favoritesList:any = [];
  countFavoriteProducts:number=0;

  basketProducts: any[] = [];
  attributesList:any;

  errorMSG: string | null = null;

  @ViewChildren('totalPriceRef') totalPriceRefs!: QueryList<ElementRef>;
  @ViewChildren('productIdRef') productIdRefs!: QueryList<ElementRef>;
  @ViewChildren('typeRef') typeRefs!: QueryList<ElementRef>;
  totalPrices: { total: number, qte:any, id: any, name: any, type: any, description:any }[] = [];
  total:any = 0;

  totalTaxPrices:any;
  totalWithTax:any = 0;
  totalShippingFees:any = 0;
  storeData:any;

  promoCode:any= null;
  promoCodeValue:any=null;
  isPromoCodeSet:any;
  promotion:any;
  

  currentDate!: Date;


  constructor(private router: Router, private authService: AuthService, private basketService:BasketService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadStoreData();
    this.basketProducts = JSON.parse(localStorage.getItem('basketProducts') || '[]') as string[];
    this.basketItemCount = parseInt(localStorage.getItem('basketItemCount') || '0', 10);
    // favorites list
    const favoritesVisitorString = localStorage.getItem("favoritesVisitor");
    if (favoritesVisitorString !== null) {
       // Parse the stored JSON string to get the array
        this.favoritesList = JSON.parse(favoritesVisitorString);
    }
    //
    this.loadAllAttributes();
    //
    this.currentDate = new Date();
     // Calculate total price after increasing quantity
     setTimeout(() => {
      this.updateTotalPrices();
    }, 0);

  }

  ngAfterViewInit(): void {
     // Calculate total price after increasing quantity
     setTimeout(() => {
      this.updateTotalPrices();
    }, 0);
  }

  removePromoCode(){
    this.isPromoCodeSet = false;
    this.promoCode = null;
    // Calculate total price after increasing quantity
    setTimeout(() => {
      this.updateTotalPrices();
    }, 0);
    
  }

  promoCodeFunc() {
    // if promocode not set
    if (!this.isPromoCodeSet){
      if (this.promoCode != null && this.promoCode.length > 0) {
        this.authService.getPromotion(this.promoCode).subscribe((res: any) => {
          if (res != null) {
            if (res.status == "inactif"){
              this.showErrorMessage("Code promo inactif.");
              this.isPromoCodeSet = false;
            }
            else{
              if (res.status == "expired"){
                this.showErrorMessage("Code promo expiré.");
                this.isPromoCodeSet = false;
              }
              // code promo type {period}
              if (res.promoType == "period"){
                const [day, month, year] = res.expiryDate.split('/');
                const givenDate = new Date(`${year}-${month}-${day}`);
                if (this.currentDate > givenDate && res.status != 'expired') {
                  this.showErrorMessage("Code promo expiré.");
                  this.isPromoCodeSet = false;
                }
                else{
                  this.promotion = res;
                  this.isPromoCodeSet = true;
                  if (this.promotion.discountType == "percent"){
                    this.promoCodeValue = this.totalWithTax - (this.totalWithTax - (this.totalWithTax * this.promotion.discountValue)/100);
                    this.totalWithTax = this.totalWithTax - this.promoCodeValue;
                  }
                  if (this.promotion.discountType == "fixed_amount"){
                    if (this.promotion.discountValue > this.totalWithTax) {
                      this.showErrorMessage("La valeur du code promotionnel dépasse largement le montant total du panier. Veuillez ajouter davantage de produits au panier.");
                      this.isPromoCodeSet = false;
                    }
                    else{
                      this.promoCodeValue =  this.promotion.discountValue;
                      this.totalWithTax = this.totalWithTax - this.promoCodeValue;
                    }
                  }
                  if (this.promotion.discountType == "free_shipping"){
                    this.promoCodeValue =  this.totalShippingFees;
                    this.totalWithTax = this.totalWithTax - this.promoCodeValue;
                    this.totalShippingFees = 0;
                  }
                }
              }
              // code promo type {allDays}
              if (res.promoType == "allDays"){
                  this.promotion = res;
                  this.isPromoCodeSet = true;
                  if (this.promotion.discountType == "percent"){
                    this.promoCodeValue = this.totalWithTax - (this.totalWithTax - (this.totalWithTax * this.promotion.discountValue)/100);
                    this.totalWithTax = this.totalWithTax - this.promoCodeValue;
                  }
                  if (this.promotion.discountType == "fixed_amount"){
                    if (this.promotion.discountValue > this.totalWithTax) {
                      this.showErrorMessage("La valeur du code promotionnel dépasse largement le montant total du panier. Veuillez ajouter davantage de produits au panier.");
                      this.isPromoCodeSet = false;
                    }
                    else{
                      this.promoCodeValue =  this.promotion.discountValue;
                      this.totalWithTax = this.totalWithTax - this.promoCodeValue;
                    }
                  }
                  if (this.promotion.discountType == "free_shipping"){
                    this.promoCodeValue =  this.totalShippingFees;
                    this.totalWithTax = this.totalWithTax - this.promoCodeValue;
                    this.totalShippingFees = 0;
                  }
                }
            }
            
          } 
          else {
            this.showErrorMessage("Code promo incorrect.");
            this.isPromoCodeSet = false;
          }
        });
      } else {
        this.showErrorMessage("Code promo invalid.");
        this.isPromoCodeSet = false;
      }
    }
    else{
      this.showErrorMessage("Vous avez déjà défini un code promotionnel");
    }
  }

  loadStoreData(){
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
    });
  }

  getShippingFees(): number {
    const countP = this.basketProducts.length;

    if (this.basketProducts.length == 0){
      this.totalShippingFees = 0;
      return this.totalShippingFees;
    }

    if (this.storeData.globalDiscountShipping != null){
      if (this.totalWithTax - this.totalShippingFees >= this.storeData.globalDiscountShipping){
        this.totalShippingFees = 0;
        return this.totalShippingFees;
      }
    }
    
    // Case: Only one product
    if (countP === 1) {
      const product = this.basketProducts[0];
      if (product.type === 'product') {
        if (product.obj.shippingPrice != null && product.obj.shippingPrice >= 0) {
          this.totalShippingFees = product.obj.shippingPrice;
          return this.totalShippingFees;
        } else {
          if (this.storeData.shippingFees != null){
            // If all shipping prices are null, return shippingFees
           this.totalShippingFees = this.storeData.shippingFees;
           return this.totalShippingFees;
          }
          else{
            this.totalShippingFees = 0;
            return this.totalShippingFees;
          }
        }
      } else if (product.type === 'variant') {
        if (product.product.shippingPrice != null && product.product.shippingPrice >= 0) {
          this.totalShippingFees = product.product.shippingPrice;
          return this.totalShippingFees;
        } else {
          if (this.storeData.shippingFees != null){
           this.totalShippingFees = this.storeData.shippingFees;
           return this.totalShippingFees;
          }
          else{
            this.totalShippingFees = 0;
            return this.totalShippingFees;
          }
        }
      }
    }
  
    // Case: More than one product
    let maxShippingPrice = 0;
    let hasNonNullShippingPrice = false;
    let shippingPricesPresent: boolean[] = [];
  
    this.basketProducts.forEach((item: any) => {
      if (item.type === 'product') {
        if (item.obj.shippingPrice != null && item.obj.shippingPrice >= 0) {
          maxShippingPrice = Math.max(maxShippingPrice, item.obj.shippingPrice);
          hasNonNullShippingPrice = true;
          shippingPricesPresent.push(hasNonNullShippingPrice);
        }
        else{
          hasNonNullShippingPrice = false;
          shippingPricesPresent.push(hasNonNullShippingPrice);
        }
      } else if (item.type === 'variant') {
        if (item.product.shippingPrice != null && item.product.shippingPrice >= 0) {
          maxShippingPrice = Math.max(maxShippingPrice, item.product.shippingPrice);
          hasNonNullShippingPrice = true;
          shippingPricesPresent.push(hasNonNullShippingPrice);
        }
        else{
          hasNonNullShippingPrice = false;
          shippingPricesPresent.push(hasNonNullShippingPrice);
        }
      }
    });
  
   // Check if all elements in the array are true
    const allTrue = shippingPricesPresent.every((value) => value === true);

    if (allTrue) {
      // If all shipping prices are present and non-null, proceed with calculating the maximum shipping price
      this.totalShippingFees = maxShippingPrice;
      return this.totalShippingFees;
    } else {
      // If any shipping price is null or missing, return storeData.shippingFees
      this.totalShippingFees = this.storeData.shippingFees;
      return this.totalShippingFees;
    }

  }
  

  increaseQte(objData: any) {
    const productIndex = this.basketProducts.findIndex((basketPR: any) => basketPR.obj.id == objData.obj.id);
  
    if (productIndex !== -1) {
      // Product found in the basket
      if (this.basketProducts[productIndex].qte < objData.obj.stock) {
        this.basketProducts[productIndex].qte ++;
        // Update the local storage
        localStorage.setItem('basketProducts', JSON.stringify(this.basketProducts));
        this.basketItemCount++;
        localStorage.setItem('basketItemCount', this.basketItemCount.toString());
        // Calculate total price after increasing quantity
        setTimeout(() => {
          this.updateTotalPrices();
        }, 0);
        this.getShippingFees();
      } else {
        if (objData.type == 'product') {
          this.showErrorMessage("Il y a que " + objData.obj.stock + " pièces disponibles dans ce produit.");
        }
        if (objData.type == 'variant') {
          this.showErrorMessage("Il y a que " + objData.obj.stock + " pièces disponibles dans ce variant.");
        }
      }
    }
  }
  
  decreaseQte(objData: any){
    const productIndex = this.basketProducts.findIndex((basketPR: any) => basketPR.obj.id == objData.obj.id);
  
    if (productIndex !== -1) {
      // Product found in the basket
      if (objData.qte > 1) {
        this.basketProducts[productIndex].qte --;
        // Update the local storage
        localStorage.setItem('basketProducts', JSON.stringify(this.basketProducts));
        this.basketItemCount--;
        localStorage.setItem('basketItemCount', this.basketItemCount.toString());
        // Calculate total price after decreasing quantity
        setTimeout(() => {
          this.updateTotalPrices();
        }, 0);
        this.getShippingFees();
      }  
    }
  }

  payNow(){
    if (this.basketProducts.length == 0 ){
      this.showErrorMessage("Le panier est vide!");
    }
    else{
      // set the data in the basket service
      this.basketService.setTotalPrices(this.totalPrices);
      this.basketService.setTotalWithTax(this.totalWithTax);
      this.basketService.setShippingFees(this.totalShippingFees);
      this.basketService.setIsPromoCodeSet(this.isPromoCodeSet);
      this.basketService.setPromotion(this.promotion);

      // navigate to CheckoutComponent
      this.router.navigate(['/checkout']);
    }
  }
  
  
  updateTotalPrices(): void {
    this.total = 0;
    this.totalPrices = [];
  
    this.totalWithTax = 0;
  
    this.totalPriceRefs.forEach((priceRef, index) => {
      const totalPriceText: string = priceRef.nativeElement.textContent.trim();
      const totalPrice: number = parseFloat(totalPriceText.replace('DT', '').trim());
      const productId: number = parseInt(this.productIdRefs.toArray()[index].nativeElement.textContent.trim());
      const type: string = this.typeRefs.toArray()[index].nativeElement.textContent.trim();
  
      // Store price, product ID, and type into the totalPrices array
      let description = '';
      let qte = 0; // Initialize quantity
      let productName = '';

      // Find the product in basketProducts by ID
      const product = this.basketProducts.find((basketPR: any) => basketPR.obj.id == productId);
      if (product) {
        qte = product.qte;
        // If it's a variant type, concatenate item names for description
        if (type === 'variant') {
          productName = product.product.name;
          description = product.obj.elements.map((item: any) => item.name).join(', ');
        }
        else{
          productName = product.obj.name;
        }
      }
      this.totalPrices.push({ total: totalPrice, qte: qte, id: productId, name: productName, type: type, description: description });

      if (type == 'product') {
        this.totalWithTax += totalPrice + ((totalPrice * product.obj.tva) / 100);
      }
  
      if (type == 'variant') {
        this.totalWithTax += totalPrice + ((totalPrice * product.product.tva) / 100);
      }
  
      // Add totalPrice directly to the total
      this.total += totalPrice;
    });
    this.getShippingFees();
  }
  
  
  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 8000);
  }

  closeError() {
    this.errorMSG = null;
  }

  clearAllBasketProducts(){
      // Clear the array
      this.basketProducts = [];
      this.basketItemCount =  0;
    
      // Update the local storage
      localStorage.removeItem('basketProducts');
      localStorage.removeItem('basketItemCount');
      //test it
      this.removePromoCode();
      this.basketProducts.length = 0;
      this.totalShippingFees = 0;

  }

  removeProduct(objData: any) {
  const productIndex = this.basketProducts.findIndex((basketPR: any) => basketPR.obj.id == objData.obj.id);

  if (productIndex !== -1) {
    // Product found in the basket, remove it
    this.basketProducts.splice(productIndex, 1);

    // Update the local storage
    localStorage.setItem('basketProducts', JSON.stringify(this.basketProducts));
    
    // Remove the product from totalPrices
    const indexInTotalPrices = this.totalPrices.findIndex(item => item.id === objData.obj.id);
    if (indexInTotalPrices !== -1) {
      this.totalPrices.splice(indexInTotalPrices, 1);
    }
    
    // Update basketItemCount
    this.basketItemCount = this.basketItemCount - objData.qte;
    localStorage.setItem('basketItemCount', this.basketItemCount.toString());
    
    // Recalculate total
    setTimeout(() => {
      this.updateTotalPrices();
    }, 0);

  }
 }

  calculateTotal(): void {
    this.total = 0;
    this.totalPrices.forEach(item => {
      this.total += item.total;
    });
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
    const userProfileString = localStorage.getItem("userProfile");

    if (userProfileString !== null) {
      // User connected, send request to the backend
      console.log("User connected. Sending request to backend.");
    } else {
      // User not connected (visitor)

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
  }

  loadProducts() {
    this.productsList = null;
    this.authService.getProducts().subscribe((res: any) => {
        this.productsList = res.filter((product:any) => {
            return product.status === 'actif';
        });
        // function to order the productList from newest to oldest based on creation_date
        this.productsList.sort((a: any, b: any) => {
          // Parse the creation_date strings to extract the date and time components
          const dateAComponents = a.creation_date.split(" ");
          const dateBComponents = b.creation_date.split(" ");
          
          // Extract date and time components for A
          const dateA = dateAComponents[0].split(":");
          const timeA = dateAComponents[1].split(":");
          
          // Extract date and time components for B
          const dateB = dateBComponents[0].split(":");
          const timeB = dateBComponents[1].split(":");
          
          // Create Date objects for comparison
          const dateAObj = new Date(parseInt(dateA[2]), parseInt(dateA[1]) - 1, parseInt(dateA[0]), parseInt(timeA[0]), parseInt(timeA[1]), parseInt(timeA[2]));
          const dateBObj = new Date(parseInt(dateB[2]), parseInt(dateB[1]) - 1, parseInt(dateB[0]), parseInt(timeB[0]), parseInt(timeB[1]), parseInt(timeB[2]));
  
          // Compare the dates in descending order
          return dateBObj.getTime() - dateAObj.getTime();
      });
    });
  }

  loadAllAttributes(){
    this.authService.getAllAttributes().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
         this.attributesList = null;
          console.log("response is 204  attributes");
        }
        else if (res.status === 500){
          console.log("response is 500 attributes");
          this.attributesList = null;
        }
        else {
          this.attributesList = res;
        }
      }
      else {
        console.log("Response is null or undefined attributes");
      }
      
       
    });
  }

  getAttribute(attribute: any) {
    if (attribute.id === undefined || attribute.id === null) {
      return this.attributesList.find((attr: any) => attr.id === attribute);
    } else {
      return this.attributesList.find((attr: any) => attr.id === attribute.id);
    }
  }
  
  

  getProductPhotoUrl(productId: string): string {
    return `${this.authService.host}/public/product/${productId}`;
  }

  getProductImagePhotoUrl(productImageID: string): string {
    return `${this.authService.host}/public/productImage/${productImageID}`;
  }

  getVariantImage(variantId: string): string {
    return `${this.authService.host}/public/variant/${variantId}`;
  }

  calculateAverageRating(ratingList :any): number {
    if (ratingList.length === 0) {
        return 0; // Return 0 if there are no ratings
    }
  
    // Calculate the sum of all ratings
    const sumOfRatings = ratingList.reduce((acc:any, rating:any) => acc + rating.stars, 0);
  
    // Calculate the average rating
    const averageRating = sumOfRatings / ratingList.length;
  
    // Round the average rating to two decimal places
    return Math.round(averageRating * 100) / 100;
  }


}
