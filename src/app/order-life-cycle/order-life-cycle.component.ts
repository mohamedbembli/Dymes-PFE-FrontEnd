import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogOrderLifeCycleStepComponent } from '../dialog-order-life-cycle-step/dialog-order-life-cycle-step.component';
import { OrderLifeCycleService } from '../services/order-life-cycle.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-life-cycle',
  templateUrl: './order-life-cycle.component.html',
  styleUrls: ['./order-life-cycle.component.scss']
})
export class OrderLifeCycleComponent implements OnInit, AfterViewInit, OnDestroy{

   homePage:any=true;
   settingsPage:any=false;

  @ViewChild('table', { static: true }) table!: MatTable<any>;
  listSteps:any= [];
  displayedColumns: string[] = [
    'stepName',
    'order',
    'status',
    'stock',
    'action',
  ];
  dataSource = this.listSteps;
  dragDisabled = true;
  primaryStepNames:any=["En attente","Confirmée","Prêt à expédier","Expédiée","Livrée","Retour non reçue","Retour reçue","Annulée"];

  constructor(public authService: AuthService, private orderLifeCycleService: OrderLifeCycleService, private toastr: ToastrService, public dialog: MatDialog) { }
  
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  
  ngAfterViewInit(): void {
    this.loadAllSteps();
  } 

  // add dialog
  openAddOrderLifeCycleStepDialog(){
    const dialogRef = this.dialog.open(DialogOrderLifeCycleStepComponent, {
      width: '600px',
      data: {
        isEditMode: false,
      }
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.stepAdded){
        console.log("data correct");
        dialogRef.close();
        this.ngAfterViewInit();
      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // end add dialog

  // update dialog
  openUpdateOrderLifeCycleStepDialog(element:any){
    const dialogRef = this.dialog.open(DialogOrderLifeCycleStepComponent, {
      width: '600px',
      data: {
        isEditMode: true, // Indicate that this is an edit operation
        step: element
      },
    });
    dialogRef.afterClosed().subscribe(async () => {
      if (dialogRef.componentInstance.stepAdded){
        console.log("data correct");
        dialogRef.close();
        this.ngAfterViewInit();
      }
      else {
        console.log("data incorrect");

      }
   });
  }
  // end update dialog

  ngOnInit(): void {
  }

  checkIfStepExists(stepName: any): boolean {
    const lowerCaseStepName = stepName.toLowerCase();
    return this.primaryStepNames.some((step:any) => step.toLowerCase() === lowerCaseStepName);
  }
  

  setPrincipalSettings(){
    this.homePage = false;
    this.settingsPage = true;
  }


  deleteStep(stepId:any){
    this.orderLifeCycleService.deleteStep(stepId).subscribe((res:any) => {
        if (res.message == "Step deleted successfully"){
          this.ngAfterViewInit();
          this.toastr.success("Votre étape a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
        }
    });
  }

  toggle(id:any, status:any, stepName:any){
    this.orderLifeCycleService.updateStatus(id,status).subscribe((res:any) => {
      if (res.message == "Status updated success."){
        this.toastr.success("status de l'étape '"+ stepName +"' à été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
      }
    });

  }

  loadAllSteps(){
    this.orderLifeCycleService.getAll().subscribe((res:any) => {
      if (res != null){
        if (res.status === 204){
          console.log("response is 204");
          this.listSteps = null;
        }
        else if (res.status === 500){
          console.log("response is 500");
          this.toastr.error("Erreur! Réessayer svp", 'Erreur', {timeOut: 3000 });
        }
        else {
          this.listSteps = res;
          this.dataSource = this.listSteps;
        }
      }
      else {
        console.log("Response is null or undefined");
        this.listSteps = null;
      }
      
       
    });
  }

  drop(event: any) {
    // Return the drag container to disabled.
    this.dragDisabled = true;

    const previousIndex = this.dataSource.findIndex((d:any) => d === event.item.data);

    console.log('previousIndex = ' + (previousIndex+1));
    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    //this.table.renderRows();
    const newIndex = this.dataSource.findIndex((d:any) => d === event.item.data);
    console.log('newIndex = ' + (newIndex+1));

    this.orderLifeCycleService.updatePosition((previousIndex+1),(newIndex+1)).subscribe((res:any) => {
      if (res.message == "Position updated success."){
        this.ngAfterViewInit();
        this.toastr.success("L'ordre de votre étape à été mis à jour avec succès!", 'Opération réussie', {timeOut: 3000 });
      }
    });
    this.table.renderRows();

  }

}
