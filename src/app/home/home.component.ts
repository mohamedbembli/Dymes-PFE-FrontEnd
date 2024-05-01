import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import SwiperCore , {Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller} from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// install Swiper components
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(SwiperComponent) swiper?: SwiperComponent;
  storeData:any=null;
  poductCategoriesList:any=null;
  productsList:any=null;
  logoPreview:any=null;
  currentYear:any;

  isOffcanvasOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isSubMenuActive: boolean = false;
  isOffcanvasHeaderOpen: boolean = false;

  ulVisibility: { [key: string]: boolean } = {};

  favoritesList:any = [];
  countFavoriteProducts:number=0;
  basketItemCount:number=0;


  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.loadStoreData();
    this.loadProductCategoies();    
    this.loadProducts();
    this.logoPreview = this.authService.host+"/public/store/logo";
    this.currentYear = this.getCurrentYear();
    // Retrieve countFavoriteProducts from local storage
    const countFavoriteProductsString = localStorage.getItem("countFavoriteProducts");
    //basket item count
    this.basketItemCount = parseInt(localStorage.getItem('basketItemCount') || '0', 10);

     // favorites list
     const favoritesVisitorString = localStorage.getItem("favoritesVisitor");
     if (favoritesVisitorString !== null) {
       // Parse the stored JSON string to get the array
       this.favoritesList = JSON.parse(favoritesVisitorString);
     }
     //
    
    if (countFavoriteProductsString !== null) {
      // Parse the stored count value
      this.countFavoriteProducts = parseInt(countFavoriteProductsString, 10);
    }
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

  getProductCategoryImageUrl(categoryId: string): string {
    return `${this.authService.host}/public/getProductCategoryImage/${categoryId}`;
  }

  getProductImagePhotoUrl(productImageID: string): string {
    return `${this.authService.host}/public/productImage/${productImageID}`;
  }

  getProductPhotoUrl(productId: string): string {
    return `${this.authService.host}/public/product/${productId}`;
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
  

  closeCanvas(){
    this.isMobileMenuOpen = false;
    this.isOffcanvasOpen = false;
    this.isOffcanvasHeaderOpen = false;
  }


  toggleSubMenu(ulId: string) {
    this.ulVisibility[ulId] = !this.ulVisibility[ulId]; // Toggle the visibility of the submenu with the specified id
    this.isSubMenuActive = !this.isSubMenuActive;

  }
  toggleMobileMenuAndHeaderOpen() {
    console.log("isMobileMenuOpen = "+this.isMobileMenuOpen);
    console.log("isOffcanvasHeaderOpen = "+this.isOffcanvasHeaderOpen);
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isOffcanvasHeaderOpen = !this.isOffcanvasHeaderOpen;
  }

  toggleOffcanvas() {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;
  }

  loadStoreData(){
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
    });
  }

  loadProductCategoies(){
    this.poductCategoriesList  = null;
    this.authService.getProductCategories().subscribe((res:any) => {
      this.poductCategoriesList = res;
    });
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


  getNumberOfSubProduct(parentName:string):number{
    let i=0;
    this.poductCategoriesList.forEach((product:any) => {
       if (product.name == parentName && product.categoryParent == 'null'){
        this.poductCategoriesList.forEach((subP:any) => {
            if (subP.name != parentName && subP.categoryParent == parentName){
              i++;
            }
        });
       }
    });
    return i;
  }

  getCurrentYear(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return currentYear;
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
