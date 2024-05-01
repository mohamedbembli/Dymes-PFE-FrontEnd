import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AttributeService } from '../services/attribute.service';

@Component({
  selector: 'app-dialog-add-attribute',
  templateUrl: './dialog-add-attribute.component.html',
  styleUrls: ['./dialog-add-attribute.component.css']
})
export class DialogAddAttributeComponent implements OnInit {

  attributeAdded:any = false;
  isEditMode:any;

  attributeID:any;
  name: any;
  type: any;

  constructor(public dialogRef: MatDialogRef<DialogAddAttributeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService,private attributeService: AttributeService) {
      if (data.isEditMode){
        this.isEditMode = data.isEditMode;
        // set Data to form
        this.attributeID = data.attributeData.id;
        this.name = data.attributeData.name;
        this.type = data.attributeData.type;
      }
     }

  ngOnInit(): void {
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }

  onSelected(value:string): void {
    this.type = value;
    console.log("new gender = "+ this.data.gender);
  }

  checkData(){
    if (this.name.length > 0 && this.type != null){
      if (!this.isEditMode){
        this.attributeService.addAttribute(this.name,this.type).subscribe((res:any) => {
          if (res.message == "Attribute added Successfully"){
            this.attributeAdded = true;
            this.cancel();
          }
      });
      }
      else {
        this.attributeService.updateAttribute(this.attributeID,this.name,this.type).subscribe({next: res => { 
          this.attributeAdded = true;
          this.cancel();  
        },
        error: err => {
          if (err.status == 500) {
            this.toastr.error("Erreur interne! Réssayer SVP!", 'Erreur', {timeOut: 2000 });
          }
        }
      });
    }

  }

}

}
