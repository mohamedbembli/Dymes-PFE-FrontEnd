import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-rating-dialog',
  templateUrl: './add-rating-dialog.component.html',
  styleUrls: ['./add-rating-dialog.component.css']
})
export class AddRatingDialogComponent implements OnInit {

  ratingSent: any = false;
  fullname: any = null;
  phoneOrMail: any = null;
  comment: any = null;
  productID:any = null;

  @Input('rating') rating: number | null = null;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  @Output() ratingUpdated = new EventEmitter();

  ratingArr: number[] = [];

  errorMSG: string | null = null;

  constructor(public dialogRef: MatDialogRef<AddRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) { 
      this.productID = data.productID;
    }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.rating = 1;
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close();
  }

  checkData() {
    if ((this.fullname != null && this.fullname.length > 0) && (this.phoneOrMail != null && this.phoneOrMail.length > 0)
    && (this.comment != null && this.comment.length > 0)){
      this.authService.addRating(this.fullname,this.phoneOrMail,this.comment,this.rating,this.productID).subscribe((res:any) => {
        if (res.message == "Rating added success."){
          this.ratingSent = true;
          this.cancel();
        }
        else{
          this.showErrorMessage("Vérifiez vos informations.");
        }
      });
    }
    else{
      this.showErrorMessage("Veuillez vérifier vos informations!");
    }


  }

  onClick(rating: number) {
    console.log(rating);
    this.rating = rating;
    this.ratingUpdated.emit(this.rating);
    return false;
  }
  

  showIcon(index: number) {
    if (this.rating !== null && this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  showErrorMessage(message: string) {
    this.errorMSG = message;
    setTimeout(() => (this.errorMSG = null), 8000);
  }

  closeError() {
    this.errorMSG = null;
  }

  

}
