import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogAddAttributeComponent } from '../dialog-add-attribute/dialog-add-attribute.component';
import { DialogAddElementComponent } from '../dialog-add-element/dialog-add-element.component';
import { AttributeService } from '../services/attribute.service';
declare var $: any;

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css'],
})
export class AttributesComponent implements OnInit, AfterViewInit, OnDestroy {
  attributesList:any;
  selectedAttribute:any;
  isDialogOpen:any = false;
  globalIDSelect:any;

   // Add attribute Dialog
   openAddAttributeDialog(): void {
    const dialogRef = this.dialog.open(DialogAddAttributeComponent, {
      width: '500px',
      height:'300px',
      data: {
        isEditMode: false // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.attributeAdded){
        console.log("data correct");
        this.loadAllAttributes();
        this.toastr.success("Votre nouvelle attribut a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
        //this.loadProductCategories();
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END add attribute Dialog

  // Edit attribute Dialog
  openEditAttributeDialog(): void {
    const dialogRef = this.dialog.open(DialogAddAttributeComponent, {
      width: '500px',
      height:'300px',
      data: {
        attributeData: this.selectedAttribute, 
        isEditMode: true, // Indicate that this is an edit operation
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.attributeAdded){
        console.log("data correct");
        this.loadAllAttributes();
        this.toastr.success("Votre attribut a été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
        dialogRef.close();

      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // END edit attribute Dialog

  // Add Element Dialog
   openAddElementDialog(): void {
    const dialogRef = this.dialog.open(DialogAddElementComponent, {
      width: '500px',
      height:'500px',
      data: {
        isEditMode: false, // Indicate that this is an edit operation
        attributeData: this.selectedAttribute, 
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
        console.log("elemnts data correct");
        dialogRef.close();

   });
  }
  // END add Element Dialog

  constructor(private attributeService:AttributeService,private toastr: ToastrService, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loadAllAttributes();
     
   }
 
   loadAllAttributes(){
     this.attributeService.loadAllAttributes().subscribe((res:any) => {
      
       if (res != null){
         if (res.status === 204){
          this.attributesList = null;
           console.log("response is 204");
         }
         else if (res.status === 500){
           console.log("response is 500");
           this.attributesList = null;
           this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
         }
         else {
           this.attributesList = res;
           this.ngAfterViewInit();
         }
       }
       else {
         console.log("Response is null or undefined");
       }
       
        
     });
   }
   
  ngOnDestroy(): void {
    $('#attributesTable').DataTable().destroy();
  }
  ngAfterViewInit(): void {
    $('#attributesTable').DataTable().destroy();
    
  const dataTable = $('#attributesTable').DataTable({
    data: this.attributesList,
    columns: [
      { data: 'id' },
      { data: 'name' },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.type == "dropdown") {
            return "Menu déroulant";
          } else if (row.type == "buttons") {
            return "Boutons";
          } else if (row.type == "images") {
            return "Image cliquables";
          } else {
            return "Couleurs cliquables";
          }
        },
      },
      {
        data: null,
        render: (data:any, type:any, row:any) => {
          if (row.elements.length == 0) {
            return "0";
          } else {
            return row.elements.length;
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
            <button type="button" class="btn btn-success elements-button">Elements</button>
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

    // Event delegation to handle the click event for "Elements" buttons
    $('#attributesTable tbody').on('click', '.elements-button', (event: Event) => {
      event.stopPropagation();
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const rowData = clickedRow.data();
      if (rowData){
        const id = rowData.id; 
        this.selectedAttribute = rowData;
        this.attributeService.getNbElementsByID(rowData.id).subscribe((res:any) => {
          if (res.message == "There are no elements in this attribute"){
            this.selectedAttribute = this.attributesList.find((attribute: any) => attribute.id === id);
            this.openAddElementDialog();
          }
          else if (res.message == "There are no attribute"){
            this.toastr.warning("attribut introuvable!", 'Vérification', {timeOut: 3000 });
          }
          else {
            this.selectedAttribute = this.attributesList.find((attribute: any) => attribute.id === id);
            this.openAddElementDialog();
          }
        });
      }
    });

    // Event delegation to handle the click event for "Supprimer" buttons
    $('#attributesTable tbody').on('click', '.delete-button', (event: Event) => {
    event.stopPropagation();
    const clickedRow = dataTable.row($(event.target).closest('tr'));
    const attribute = clickedRow.data();
         this.deleteAttribute(attribute);
    });

    // Event delegation to handle the click event for update buttons
    $('#attributesTable tbody').on('click', '.update-button', (event: Event) => {
      event.stopPropagation(); // Stop event propagation to prevent multiple dialogs
    
      // Check if the dialog is already open
      if (this.isDialogOpen) {
        return;
      }
    
      const clickedRow = dataTable.row($(event.target).closest('tr'));
      const rowData = clickedRow.data();
    
      if (rowData) {
        const id = rowData.id; // Assuming there is an 'id' property in your row data
        this.selectedAttribute = this.attributesList.find((attribute: any) => attribute.id === id);
    
        // Set the flag to indicate that the dialog is open
       // this.isDialogOpen = true;
        this.openEditAttributeDialog();
      }
    });

    $('#attributesTable tbody').on('click', 'tr', (event: Event) => {
      event.stopPropagation();
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      const id = $(clickedRow).data('id');
      console.log(id);
      this.globalIDSelect = id;
      this.selectedAttribute = this.attributesList.find((user:any) => user.id === id);        


    })
    
  }

  deleteAttribute(attribute: any): void {
    if (attribute && attribute.id) {
      const deletedAttributeId = attribute.id;
      this.attributeService.deleteAttribute(deletedAttributeId).subscribe((res:any) =>{
          if (res.message == "Attribute deleted successfully"){
              this.toastr.success("Votre Attribut a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
               // Determine the index of the attribute in the attributeList
              const index = this.attributesList.indexOf(attribute);
          
              // Check if the attribute is found in the list
              if (index !== -1) {
                // Remove the attribute from the attributeList
                this.attributesList.splice(index, 1);
          
                this.loadAllAttributes();
              }
          }
          else{
            this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
          }
      });
  
   
    }
  }

}
