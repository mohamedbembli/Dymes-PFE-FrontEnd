import { Component, OnInit } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {

  isMobileMenuOpen: boolean = false;
  productsList:any = [];
  betaProductList:any = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const favoritesVisitorString = localStorage.getItem("favoritesVisitor");
    if (favoritesVisitorString !== null ) {
      this.betaProductList = JSON.parse(favoritesVisitorString);
      localStorage.setItem("countFavoriteProducts",this.betaProductList.length);
      // recheck product and put it again in the list ( updated data (stock,price,name,..) )
      // Assuming this.betaProductList is an array of product IDs
      const observables = this.betaProductList.map((product: any) => {
        return this.authService.getProduct(product.id);
      });

      forkJoin(observables).subscribe(
        (responses: any) => {
            // All requests are complete, responses is an array of product data
            responses.forEach((res: any) => {
                this.productsList.push(res);
            });

            // Store the updated list in localStorage
            localStorage.setItem("favoritesVisitor", JSON.stringify(this.productsList));
        },
        (error) => {
            console.error('Error fetching products:', error);
        }
      );
    } else {
      localStorage.removeItem("countFavoriteProducts");
      console.error("Key 'favoritesVisitor' not found in local storage.");
    }

  }

  removeFavoriteProduct(productID: any) {
    // remove the product with the specified ID from the productsList
    this.productsList = this.productsList.filter((p: any) => p.id !== productID);
    this.betaProductList = this.productsList;

    // update localStorage with the updated productsList
    localStorage.setItem("favoritesVisitor", JSON.stringify(this.productsList));

    // update the count of favorite products in localStorage
    let count = parseInt(localStorage.getItem("countFavoriteProducts") || "0", 10) - 1;
    localStorage.setItem("countFavoriteProducts", count.toString());
}

  
  checkStock(productId: any): any {
    let product = this.productsList.find((p: any) => p.id === productId);

    if (product.stock != null && product.stock > 0) {
        return product.stock; // product has stock
    }

    if (product.stock == null || product.stock == 0) {
        let countVariantsStock = 0;

        // check if there are variants
        let variants = product.variants;

        if (variants && variants.length > 0) {
            // iterate through variants to calculate stock
            for (let i = 0; i < variants.length; i++) {
                let variant = variants[i];

                // assuming each variant has a 'stock' property
                if (variant.stock != null && variant.stock > 0) {
                    countVariantsStock += variant.stock;
                }
            }
        }

        return countVariantsStock;
    }
}
  

  getProductPhotoUrl(productId: string): string {
    return `${this.authService.host}/public/product/${productId}`;
  }


}
