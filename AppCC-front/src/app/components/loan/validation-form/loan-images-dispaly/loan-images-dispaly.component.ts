import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-images-dispaly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-images-dispaly.component.html',
  styleUrl: './loan-images-dispaly.component.css'
})
export class LoanImagesDispalyComponent {
  imageSrc: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<LoanImagesDispalyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: File }
  ) {
    this.loadImage();
  }

  loadImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
    reader.readAsDataURL(this.data.image);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
