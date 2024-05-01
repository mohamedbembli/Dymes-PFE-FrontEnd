import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header-store',
  templateUrl: './header-store.component.html',
  styleUrls: ['./header-store.component.css']
})
export class HeaderStoreComponent implements OnInit {
  logoPreview:any=null;
  storeData:any=null;

  isOffcanvasOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isSubMenuActive: boolean = false;
  isOffcanvasHeaderOpen: boolean = false;

  ulVisibility: { [key: string]: boolean } = {};

  poductCategoriesList:any=null;

  favoritesList:any = [];
  @Input() countFavoriteProducts!:number;
  @Input() basketItemCount!:number;

  searchTerm:any="";
  selectedCategoryName:any="-1";

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  searchNow(){
    if (this.searchTerm.length == 0 && this.selectedCategoryName != "-1"){
      this.router.navigate(['/product-category/'+this.selectedCategoryName]);
    }
    if (this.searchTerm.length > 0 && this.selectedCategoryName != "-1"){
      this.router.navigate(['/product-category/'+this.selectedCategoryName+'/'+this.searchTerm]);
    }
  }

  ngOnInit(): void {
     this.loadStoreData();
     this.loadProductCategoies();
     this.logoPreview = this.authService.host+"/public/store/logo";    
     // Retrieve countFavoriteProducts from local storage
     const countFavoriteProductsString = localStorage.getItem("countFavoriteProducts");
     // basket item count
     this.basketItemCount = parseInt(localStorage.getItem('basketItemCount') || '0', 10);
    
     if (countFavoriteProductsString !== null) {
       // Parse the stored count value
       this.countFavoriteProducts = parseInt(countFavoriteProductsString, 10);
     }
  }

  isConnected(){
    return this.authService.isAuthenticated();
  }

  loadStoreData(){
    this.authService.getStoreData().subscribe((res:any) => {
      this.storeData = res;
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

  loadProductCategoies(){
    this.poductCategoriesList  = null;
    this.authService.getProductCategories().subscribe((res:any) => {
      this.poductCategoriesList = res;
    });
  }

}
