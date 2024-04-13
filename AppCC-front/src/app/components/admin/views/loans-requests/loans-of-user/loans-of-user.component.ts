import { Component, OnInit } from '@angular/core';
import { Loan } from '../../../../../models/loan.model';
import { LoanSharingService } from '../../../../../services/loan-sharing.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoanDetailsImageComponent } from './loan-details-dialog/loan-details-image.component';

@Component({
  selector: 'app-loans-of-user',
  templateUrl: './loans-of-user.component.html',
  styleUrls: ['./loans-of-user.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LoansOfUserComponent implements OnInit {

  loans: Loan[] = [];
  dialogRef: any; // Reference to the dialog
  constructor(private loanSharingService: LoanSharingService ,private dialog: MatDialog) { }

  ngOnInit(): void {
    // Retrieve the loans data from the shared service
    this.loanSharingService.getLoans().then(loans => {
      this.loans = loans;
      console.log('Loans:', this.loans);
    }).catch(error => {
      console.error('Error fetching loans:', error);
    });
  }    

    // Open dialog with loan details
    openDialog(file : File ): void {
      // Close any existing dialog before opening a new one
      if (this.dialogRef) {
        this.dialogRef.close();
      }
  
      // Open new dialog
      this.dialogRef = this.dialog.open(LoanDetailsImageComponent, {
        width: '500px',
        data: { Image: file },
      });
  
      // Handle dialog close event
      this.dialogRef.afterClosed().subscribe(() => {
        console.log('The dialog was closed');
        this.dialogRef = null; // Reset dialog reference
      });
    }
}
