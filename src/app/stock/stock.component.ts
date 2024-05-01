import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
declare var $: any;

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, AfterViewInit, OnDestroy {
  productsList:any;

  constructor(private productService: ProductService, public authService: AuthService) { 
    
  }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  getVariantDescription(variant:any){
    let description="";
    description = variant.elements.map((item: any) => item.name).join(', ');
    return description;
  }

  getSellPricesValue(){
    let stockSellPriceValue=0;
    this.productsList.forEach((product:any) => {
      if (product.stock != null && product.stock > 0) {
        stockSellPriceValue += product.stock * product.sellPrice;
      }
       // check if there are variants
       let variants = product.variants;

       if (variants && variants.length > 0) {
           // iterate through variants to calculate stock
           for (let i = 0; i < variants.length; i++) {
               let variant = variants[i];

               // assuming each variant has a 'stock' property
               if (variant.stock != null && variant.stock > 0) {
                stockSellPriceValue += variant.stock * variant.price;
               }
           }
       }
    });
    return stockSellPriceValue;
  }

  getStockValue(){
    let stockValue=0;
    let stockCount=0;
    this.productsList.forEach((product:any) => {
      if (product.stock != null && product.stock > 0) {
        stockCount += product.stock; 
      }
       // check if there are variants
       let variants = product.variants;

       if (variants && variants.length > 0) {
           // iterate through variants to calculate stock
           for (let i = 0; i < variants.length; i++) {
               let variant = variants[i];

               // assuming each variant has a 'stock' property
               if (variant.stock != null && variant.stock > 0) {
                  stockCount += variant.stock;
               }
           }
       }
       stockValue += stockCount * product.buyPrice;
       stockCount = 0;
    });
    return stockValue;
  }

  getAvailableStock(){
    let stockCount=0;
    this.productsList.forEach((product:any) => {
      if (product.stock != null && product.stock > 0) {
        stockCount += product.stock; 
      }
       // check if there are variants
       let variants = product.variants;

       if (variants && variants.length > 0) {
           // iterate through variants to calculate stock
           for (let i = 0; i < variants.length; i++) {
               let variant = variants[i];

               // assuming each variant has a 'stock' property
               if (variant.stock != null && variant.stock > 0) {
                  stockCount += variant.stock;
               }
           }
       }
    });
    return stockCount;
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

  ngOnDestroy(): void {
    $('#stockTable').DataTable().destroy();
  }
  ngAfterViewInit(): void {
    $('#stockTable').DataTable().destroy();

    const dataTable = $('#stockTable').DataTable({
      rowCallback: (row:any, data:any) => {
        // Add data-id attribute to each row
        $(row).attr('data-id', data.id);
      },
      searching: true,
      paging: true,
      });
  }

}
