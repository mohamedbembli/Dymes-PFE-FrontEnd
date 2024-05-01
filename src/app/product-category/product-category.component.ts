import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogAddCategoryProductComponent } from '../dialog-add-category-product/dialog-add-category-product.component';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ProductCategoryService } from '../services/product-category.service';
declare var $: any;

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  
  productCategoryList:any;
  isDialogOpen:any = false;
  selectedProductCategory:any =null;

  constructor(public authService: AuthService, private productCategoryService: ProductCategoryService, private adminService: AdminService, private route: ActivatedRoute, private router: Router,private toastr: ToastrService,public dialog: MatDialog) { }
  // Add product category Dialog
  openAddProductCategoryDialog(): void {
    const dialogRef = this.dialog.open(DialogAddCategoryProductComponent, {
      width: '700px',
      height:'500px',
      data: {
        isEditMode: false // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.categoryProductAdded){
        console.log("data correct");
        this.toastr.success("Votre nouvelle catégorie a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
        this.loadProductCategories();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END add product category Dialog

  // Edit product category Dialog
  openEditProductCategoryDialog(): void {
    const dialogRef = this.dialog.open(DialogAddCategoryProductComponent, {
      width: '700px',
      height:'500px',
      data: {
        productCategoryData: this.selectedProductCategory, 
        isEditMode: true, // Indicate that this is an edit operation
      },
    });
  
    dialogRef.afterClosed().subscribe(async () => {
      this.isDialogOpen = false;
      if (dialogRef.componentInstance.categoryProductAdded) {
        console.log('ProductCategory data updated successfully');
        this.toastr.success("Votre catégorie a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
        dialogRef.close();
        this.loadProductCategories();
      } else {
        console.log('ProductCategory data not updated');
      }
    });
  }
  // END Edit Personal Dialog

  loadProductCategories(){
    this.productCategoryService.loadAllProductCategories().subscribe((res:any) => {
      this.productCategoryList = res;
      console.log(res);
    // Initialize DataTables after data is loaded
    this.ngAfterViewInit();

    });
  }

  ngOnInit(): void {
    this.loadProductCategories();
  }

  ngAfterViewInit(): void {
  $('#productCategoryTable').DataTable().destroy();
    
  const dataTable = $('#productCategoryTable').DataTable({
    data: this.productCategoryList,
    columns: [
      { data: 'id' },
      {
        // Custom column for logo image
        data: null,
        render: (data:any, type:any, row:any) => {
            return '<img src="' + this.authService.host + '/public/getProductCategoryImage/' + row.id + '" width="42" height="42" class="rounded-circle my-n1 zoom" alt="Avatar">';
        },
      },
      { data: 'name' },
      { data: 'description' },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.categoryParent == 'null') {
            return "Pas de catégorie parente";
          } else {
            return row.categoryParent;
          }
        },
      },
      {
        // Custom column for status
        data: null,
        render: (data: any, type: any, row: any) => {
          if (row.status) {
            return `
              <td>
                <span class="badge bg-success">Actif</span>&nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw align-middle clickable-icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </td>
            `;
          } else {
            return `
            <td>
              <span class="badge bg-warning">Inactif</span>&nbsp;
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw align-middle clickable-icon"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </td>
          `;
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

     // Event delegation to handle the click event for "Supprimer" buttons
     $('#productCategoryTable tbody').on('click', '.delete-button', (event: Event) => {
      event.stopPropagation();
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const productCategory = clickedRow.data();

      // Call the deleteProductCategory method to remove the productCategory
      this.deleteProductCategory(productCategory);
    });

    // Event delegation to handle the click event for clickable icons
    $('#productCategoryTable tbody').on('click', '.clickable-icon', (event: Event) => {
      event.stopPropagation();
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const productCategory = clickedRow.data();

      if (productCategory && productCategory.status !== undefined) {
        // Access the 'suspension' property from the 'employee' object
        const statusValue = !productCategory.status; // change suspension value to update it directly in backend
        console.log('New Suspension Value:', statusValue);
        // update suspesion value with backend
        this.productCategoryService.changeStatus(productCategory.id,statusValue).subscribe((res:any) => {
          if (res.message == "productCategory status updated successfully"){
            this.loadProductCategories();
            this.toastr.success("Votre catégorie status a été mise à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
        });
      }
    });

    // Event delegation to handle the click event for update buttons
    $('#productCategoryTable tbody').on('click', '.update-button', (event: Event) => {
      event.stopPropagation(); // Stop event propagation to prevent multiple dialogs
    
      // Check if the dialog is already open
      if (this.isDialogOpen) {
        return;
      }
    
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const rowData = clickedRow.data();
    
      if (rowData) {
        const id = rowData.id; // Assuming there is an 'id' property in your row data
        this.selectedProductCategory = this.productCategoryList.find((productCategory: any) => productCategory.id === id);
    
        // Set the flag to indicate that the dialog is open
        this.isDialogOpen = true;
        this.openEditProductCategoryDialog();
      }
    });
    

    $('#productCategoryTable tbody').on('click', 'tr', (event: Event) => {
      event.stopPropagation();
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      const id = $(clickedRow).data('id');
      console.log(id);
      this.selectedProductCategory = this.productCategoryList.find((productCategory:any) => productCategory.id === id);        
    });
}

deleteProductCategory(productCategory: any): void {
  if (productCategory && productCategory.id) {
    // Get the ID of the productCategory before removing it
    const deletedproductCategoryId = productCategory.id;
    this.productCategoryService.deleteProductCategory(deletedproductCategoryId).subscribe((res:any) =>{
        if (res.message == "productCategory deleted successfully"){
            this.toastr.success("Votre catégorie a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
             // Determine the index of the productCategory in the productCategoryList
            const index = this.productCategoryList.indexOf(productCategory);
        
            // Check if the productCategory is found in the list
            if (index !== -1) {
              // Remove the productCategory from the productCategoryList
              this.productCategoryList.splice(index, 1);
        
              // Log the ID of the deleted productCategory
              console.log('Deleted productCategory ID:', deletedproductCategoryId);
              this.loadProductCategories();
            }
        }
        else{
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
    });

 
  }
}

  ngOnDestroy(): void {
    $('#productCategoryTable').DataTable().destroy();
  }



}
