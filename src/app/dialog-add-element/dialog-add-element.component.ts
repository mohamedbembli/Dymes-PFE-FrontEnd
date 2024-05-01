import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ElementService } from '../services/element.service';

@Component({
  selector: 'app-dialog-add-element',
  templateUrl: './dialog-add-element.component.html',
  styleUrls: ['./dialog-add-element.component.css']
})
export class DialogAddElementComponent implements OnInit {

  attributeName:any;
  attributeID:any;
  attributType:any;

  elementName:any;
  elementRef:any;
  updateElementID:any;

  elementsList:any;
  datatableItems: any[] = [];

  constructor(public dialogRef: MatDialogRef<DialogAddElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService,private elementService: ElementService) { 
      this.attributeName = data.attributeData.name;
      this.attributeID = data.attributeData.id;
      this.attributType = data.attributeData.type;
    }

  ngOnInit(): void {
    this.loadElements();
  }

  loadElements(){
    this.elementService.getElementsByAttribute(this.attributeID).subscribe({next: res => { 
      this.elementsList = res;
      for (const element of this.elementsList) {
        this.datatableItems.push({ Attribut: this.attributeName, Nom: element.name, Ref: element.reference });
      }
    }
  });

  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }

  checkData(){
    if (this.elementName.length > 0 && this.elementRef.length > 0){
          this.elementService.addElement(this.attributeID,this.elementName,this.elementRef).subscribe((res:any) => {
              if (res.message == "Element added Successfully"){
                this.datatableItems.push({ Attribut: this.attributeName, Nom: this.capitalizeFirstLetter(this.elementName), Ref: this.capitalizeFirstLetter(this.elementRef) });
                this.toastr.success("Votre nouvelle element a été ajoutée avec succès!", 'Opération réussie', {timeOut: 3000 });
              }
              else if (res.message == "Element already exist"){
                this.toastr.warning("Cette élement existe déja dans cette attribut!", 'Information', {timeOut: 3000 });
              }
              else {
                this.toastr.error("Erreur interne! Réssayer SVP!", 'Erreur', {timeOut: 2000 });
              }
          });

    }

  }



  removeItem(index: number, item: any) {
    this.datatableItems.splice(index, 1);
    this.elementService.deleteElement(this.attributeID,item.Nom,item.Ref).subscribe((res:any) => {
      if (res.message == "Element deleted successfully"){
        this.toastr.success("Votre element a été supprimé avec succès!", 'Opération réussie', {timeOut: 3000 });
      }
      else {
        this.toastr.error("Erreur interne! Réssayer SVP!", 'Erreur', {timeOut: 2000 });
      }
    });
  }


  capitalizeFirstLetter(input:any) {
    if (!input || input.length === 0) {
        return input;
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  }




}
