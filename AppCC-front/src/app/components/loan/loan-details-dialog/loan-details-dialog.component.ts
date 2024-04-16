import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Loan } from '../../../models/loan.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-details-dialog',
  templateUrl: './loan-details-dialog.component.html',
  styleUrls: ['./loan-details-dialog.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LoanDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoanDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { loan: Loan }
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
