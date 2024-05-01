import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-category-shop',
  templateUrl: './category-shop.component.html',
  styleUrls: ['./category-shop.component.css']
})
export class CategoryShopComponent implements OnInit {

  isMobileMenuOpen: boolean = false;
  basketItemCount: number = 0; // Initialize a variable to count items in the basket
  productsList:any=null;
  primaryProductsList:any=null;
  

  basketProducts: any[] = [];

  favoritesList:any = [];
  countFavoriteProducts:number=0;

  isGridActive: boolean = true;
  isMobileFilterActive: boolean = false;

  fromRangePrice:any=null;
  toRangePrice:any=null;

  filterValue:any="1";

  filterByRecentDate:any=true;
  filterByBestRating:any=false;
  categoryName:any="";
  searchTerm:any="";


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const urlSearchTerm = params['searchTerm'];
      const name = params['name'];
      this.categoryName = name;
      // Load products and then filter
      this.loadProducts(name).then(() => {
        if (urlSearchTerm !== undefined) {
          this.productsList = this.productsList.filter((product:any) => 
            product.name.toLowerCase().includes(urlSearchTerm.toLowerCase()));
        }
      });
    });

    // Retrieve countFavoriteProducts from local storage
    const countFavoriteProductsString = localStorage.getItem("countFavoriteProducts");
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
  

  toggleView(view: string) {
    this.isGridActive = (view === 'grid');
  }

  mobileFilter(){
    if (this.isMobileFilterActive)
      this.isMobileFilterActive = false;
    else
      this.isMobileFilterActive = true;
  }

  closeMobileFilter(){
    this.isMobileFilterActive = false;
  }

  getProductPhotoUrl(productId: string): string {
    return `${this.authService.host}/public/product/${productId}`;
  }

  getProductImagePhotoUrl(productImageID: string): string {
    return `${this.authService.host}/public/productImage/${productImageID}`;
  }

  isFavorite(productId: number): boolean {
    // Check if favoritesList contains the product with the given ID
    return this.favoritesList.some((item:any) => item.id === productId);
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


  loadProducts(categoryName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.productsList = null;
      this.authService.getProducts().subscribe(
        (res: any) => {
          // Filter products based on category name
          this.productsList = res.filter((product: any) => product.category.name === categoryName && product.status === 'actif');
          this.primaryProductsList = res.filter((product: any) => product.category.name === categoryName && product.status === 'actif');
          if (this.productsList.length === 0) {
            this.productsList = res.filter((product: any) => product.category.categoryParent === categoryName && product.status === 'actif');
            this.primaryProductsList = res.filter((product: any) => product.category.name === categoryName && product.status === 'actif');
          }
          // Sort the productList based on filters
          if (this.filterByRecentDate) {
            this.sortProductsByRecentDate();
          } else if (this.filterByBestRating) {
            this.sortProductsByBestRating();
          }
          resolve(); // Resolve the promise when products are loaded and sorted
        },
        (error: any) => {
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }

  private createDateObject(dateComponents: string[]): Date {
    const date = dateComponents[0].split(":");
    const time = dateComponents[1].split(":");
    return new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]), parseInt(time[0]), parseInt(time[1]), parseInt(time[2]));
  }
  private sortProductsByRecentDate() {
    this.productsList.sort((a: any, b: any) => {
      const dateAComponents = a.creation_date.split(" ");
      const dateBComponents = b.creation_date.split(" ");
      const dateAObj = this.createDateObject(dateAComponents);
      const dateBObj = this.createDateObject(dateBComponents);
      return dateBObj.getTime() - dateAObj.getTime();
    });
  }
  private sortProductsByBestRating() {
    this.productsList.sort((a: any, b: any) => {
      const averageRatingA = this.calculateAverageRating(a.ratings);
      const averageRatingB = this.calculateAverageRating(b.ratings);
      return averageRatingB - averageRatingA;
    });
  }
  
  

  getProductsPriceRange() {
    let from = this.fromRangePrice;
    let to = this.toRangePrice;
    console.log("from = " + from);
    console.log("to = " + to);

    if (from == null && to == null) {
        // Case 1: Both from and to are null, return all products
        this.productsList = this.primaryProductsList;
    } else if (from != null && to == null) {
        // Case 2: To is null and from is not null, return products with price > from
        this.productsList = this.primaryProductsList.filter((product: any) => {
            const productPrice = this.getProductPrice(product);
            return productPrice >= from;
        });
    } else if (from == null && to != null) {
        // Case 3: To is not null and from is null, return products with price < to
        this.productsList = this.primaryProductsList.filter((product: any) => {
            const productPrice = this.getProductPrice(product);
            return productPrice <= to;
        });
    } else {
        // Case 4: Both from and to are not null, return products with price between [from, to]
        this.productsList = this.primaryProductsList.filter((product: any) => {
            const productPrice = this.getProductPrice(product);
            return productPrice >= from && productPrice <= to;
        });
    }
}



  getProductPrice(product: any): number {
    // Initialize minPrice with the base price
    let minPrice = product.sellPrice;

    if (product.simpleDiscountValue != null) {
        if (product.simpleDiscountType === 'fixed') {
            minPrice -= product.sellPrice - product.simpleDiscountValue;
        } else if (product.simpleDiscountType === 'percent') {
            minPrice -= (product.sellPrice * product.simpleDiscountValue) / 100;
        }
    }

    // Check if the product has variants
    if (product.variants && product.variants.length > 0) {
        // Calculate the minimum price among variant prices
        const variantMinPrice = Math.min(...product.variants.map((variant: any) => {
            let variantPrice = variant.price;
            if (variant.discounts && variant.discounts.length > 0) {
                variant.discounts.forEach((discount: any) => {
                    if (discount.type === 'fixed') {
                        variantPrice -= discount.value;
                    } else if (discount.type === 'percent') {
                        variantPrice -= (variant.price * discount.value) / 100;
                    }
                });
            }
            return variantPrice;
        }));

        // Update minPrice if the variant price is lower
        minPrice = Math.min(minPrice, variantMinPrice);
    }

    console.log("getProductPrice minPrice = " + minPrice);
    return minPrice;
}


  filterChange(){
    console.log("filter value = "+this.filterValue);
    if (this.filterValue == 1){
      this.filterByRecentDate = true;
      this.filterByBestRating = false;
    }
    if (this.filterValue == 2){
      this.filterByRecentDate = false;
      this.filterByBestRating = true;
    }
    this.loadProducts(this.categoryName);
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

   // Filter the product list based on the name matching the search term
   filterProductListByName() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.productsList = this.productsList.filter((product:any) => product.name.toLowerCase().includes(searchTermLower));
  }

   searchByNameFilter(){
    if (this.searchTerm != null && this.searchTerm.length > 0 ){

      this.filterProductListByName();
    }
    else{
      this.loadProducts(this.categoryName);
    }
   }

}
