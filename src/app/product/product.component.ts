import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  productsList:any;
  isDialogOpen:any = false;
  selectedProduct:any;


  constructor(public authService: AuthService, private productService: ProductService, private route: ActivatedRoute, private router: Router,private toastr: ToastrService,public dialog: MatDialog) { }
  
   // Add product category Dialog
   openAddProductDialog(): void {
    const dialogRef = this.dialog.open(DialogAddProductComponent, {
      width: '1500px',
      height:'800px',
      data: {
        isEditMode: false // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.productAdded){
        console.log("data correct");
        this.loadAllProducts();
        this.toastr.success("Votre nouvelle produit a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
        //this.loadProductCategories();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END add product category Dialog

  // Edit product category Dialog
  openEditProductDialog(): void {
    const dialogRef = this.dialog.open(DialogAddProductComponent, {
      width: '1500px',
      height:'800px',
      data: {
        productData: this.selectedProduct,
        isEditMode: true // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.productUpdated){
        console.log("data update correct");
        this.loadAllProducts();
        this.toastr.success("Votre produit a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
        //this.loadProductCategories();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END Edit product category Dialog

  ngOnInit(): void {
    this.loadAllProducts();
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
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.productsList = res;
          this.ngAfterViewInit();
        }
      }
      else {
        console.log("Response is null or undefined");
        this.productsList = null;
      }
      
       
    });
  }

  ngOnDestroy(): void {
    $('#productsTable').DataTable().destroy();
  }
  ngAfterViewInit(): void {
    $('#productsTable').DataTable().destroy();
    const dataTable = $('#productsTable').DataTable({
      data: this.productsList,
      columns: [
        { data: 'id' },
        {
          // Custom column for logo image
          data: null,
          render: (data:any, type:any, row:any) => {
              return '<img src="' + this.authService.host + '/public/product/' + row.id + '" width="42" height="42" class="rounded-circle my-n1 zoom" alt="Avatar">';
          },
        },
        { data: 'name' },
        { data: 'sellPrice' },
        {
          // Custom column for discount
          data: null,
          render: (data: any, type: any, row: any) => {
            if (row.simpleDiscountValue != null) {
              if (row.simpleDiscountType == 'fixed') {
                // Add the fixed discount
                const discountAmount = row.sellPrice - row.simpleDiscountValue;
                return discountAmount;
              }
              if (row.simpleDiscountType == 'percent') {
                // Calculate the percentage discount
                const discountAmount = (row.sellPrice * row.simpleDiscountValue) / 100;
                return row.sellPrice - discountAmount;
              }
            }
            // Handle other cases or provide a default value
            return row.sellPrice;
          
          },
        },
        {
          // Custom column for stock
          data: null,
          render: (data: any, type: any, row: any) => {
            if (row.stock != null && row.variants != null) {
              let pStock=row.stock;
              row.variants.forEach((variant:any) => {
                pStock+= variant.stock;
              });
              return pStock+" pièces";
            }
            if (row.stock != null && row.variants == null) {
              return row.stock+" pièces";
            }
            if (row.stock == null && row.variants != null) {
              let pStock=0;
              row.variants.forEach((variant:any) => {
                pStock+= variant.stock;
              });
              return pStock+" pièces";
            }
            if (row.stock == null && row.variants == null) {
              return "0 pièces";
            }
            // Handle other cases or provide a default value
            return "0 pièces";
          
          },
        },
        {
          // Custom column for status
          data: null,
          render: (data: any, type: any, row: any) => {
            if (row.status == 'actif') {
              return "En ligne";
            } else {
              return "Hors ligne";
            }
          },
        }, 
        {
          // Custom column for action buttons
          data: null,
          render: (data:any, type:any, row:any) => {
            return `
              <button type="button" class="btn btn-primary update-button">Modifier</button>
              <button type="button" class="btn btn-danger delete-button">Supprimer</button>
            `;
          },
        },
        
      ],
      rowCallback: (row:any, data:any) => {
        // Add data-id attribute to each row
        $(row).attr('data-id', data.id);
      },
      searching: true,
      paging: true,
 });

 // Event delegation to handle the click event for update buttons
 $('#productsTable tbody').on('click', '.update-button', (event: Event) => {
  event.stopPropagation(); // Stop event propagation to prevent multiple dialogs

  // Check if the dialog is already open
  if (this.isDialogOpen) {
    return;
  }

  const clickedRow = dataTable.row($(event.target).closest('tr'));
  const rowData = clickedRow.data();

  if (rowData) {
    const id = rowData.id; // Assuming there is an 'id' property in your row data
    this.selectedProduct = this.productsList.find((attribute: any) => attribute.id === id);

    // Set the flag to indicate that the dialog is open
   // this.isDialogOpen = true;
    this.openEditProductDialog();
  }
});
}

}
