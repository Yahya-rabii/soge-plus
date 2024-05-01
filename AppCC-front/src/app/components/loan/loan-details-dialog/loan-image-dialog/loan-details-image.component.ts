// loan-details-image.component.ts

import { Component, Inject ,HostBinding } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-image-dialog',
  templateUrl: './loan-details-image.component.html',
  styleUrls: ['./loan-details-image.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LoanDetailsImageComponent {


  @HostBinding('attr.id')
  get id(): string {
    // Generate a unique ID here
    return 'unique-id-for-component';
  }

   img = new Image();

  constructor(
    public dialogRef: MatDialogRef<LoanDetailsImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Image: File }
  ) {
    
   
    this.img.src = 'data:image/png;base64,' + data.Image;

  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
