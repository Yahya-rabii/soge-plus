// loan-details-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Loan } from '../../../models/loan.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoanDetailsImageComponent } from './loan-image-dialog/loan-details-image.component';

@Component({
    selector: 'app-loan-details-dialog',
    templateUrl: './loan-details-dialog.component.html',
    styleUrls: ['./loan-details-dialog.component.css'],
    standalone: true,
    imports: [CommonModule, MatIconModule]
})
export class LoanDetailsDialogComponent {
    openFabIndex: number | null = null; // Index of the opened FAB
  dialogRef: any // Reference to the dialog  
  
    constructor(
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { loan: Loan }
    ) { }

    onCloseClick(): void {
      this.dialogRef = this.dialog.closeAll();
    }

    // Open dialog with loan details
    // Open dialog with loan details
    openDialog(file: File): void {
      // Close any existing dialog before opening a new one
      if (this.dialogRef) {
          this.dialogRef.close(); // Close the image dialog
          // Reset dialog reference
          this.dialogRef = null;
      }

      // Open new dialog
      this.dialogRef = this.dialog.open(LoanDetailsImageComponent, {
          width: '500px',
          data: { Image: file },
      });

      // Handle dialog close event
      this.dialogRef.afterClosed().subscribe(() => {
          // Do not close the loan details dialog here
          // Reset dialog reference
          this.dialogRef = null;
      });
    }


    // Toggle visibility of the speed dial
    toggleSpeedDial(): void {
        this.openFabIndex = this.openFabIndex === null ? 0 : null;
    }
}
