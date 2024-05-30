import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Loan } from '../../../models/loan.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoanDetailsImageComponent } from './loan-image-dialog/loan-details-image.component';
@Component({
  selector: 'app-loan-details-dialog',
  templateUrl: './loan-details-dialog.component.html',
  styleUrls: ['./loan-details-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class LoanDetailsDialogComponent {
  openFabIndex: number | null = null;
  dialogRef: any;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { loan: Loan },
  ) {}
  onCloseClick(): void {
    this.dialogRef = this.dialog.closeAll();
  }
  openDialog(file: File): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.dialogRef = this.dialog.open(LoanDetailsImageComponent, {
      width: '500px',
      data: { Image: file },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }
  toggleSpeedDial(): void {
    this.openFabIndex = this.openFabIndex === null ? 0 : null;
  }
}
