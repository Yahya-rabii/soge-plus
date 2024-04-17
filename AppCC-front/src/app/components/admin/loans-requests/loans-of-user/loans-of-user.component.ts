import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Loan } from '../../../../models/loan.model';
import { LoanSharingService } from '../../../../services/loan-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanDetailsImageComponent } from './loan-details-dialog/loan-details-image.component';
import { LoanService } from '../../../../services/loan.service';
import { CommonModule } from '@angular/common';

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
  constructor(private loanSharingService: LoanSharingService ,
              private dialog: MatDialog ,
              private loanService: LoanService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getLoans(); // Load loans on component initialization
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
      this.dialogRef = null; // Reset dialog reference
    });
  }

  getLoans(): void {
    this.loans = [];
    this.loanService.getLoansByClientId(sessionStorage.getItem('UserId') ?? '').then(loans => {
      this.loans = loans;
      this.cdr.detectChanges(); // Trigger change detection after updating loans array
    }).catch(error => {
      console.error('Error fetching loans:', error);
    });
  }

  approveLoan(loan: Loan) {
    this.loanService.approveLoan(loan).then((updatedLoan) => {
      // Update the loans array in the component with the updated loan
      const index = this.loans.findIndex(l => l.id === updatedLoan.id);
      if (index !== -1) {
        this.loans[index] = updatedLoan;
        this.cdr.detectChanges(); // Trigger change detection after updating loans array
        window.location.reload();
      }
    }).catch(error => {
      console.error('Error approving loan:', error);
    });
  }

  rejectLoan(loan: Loan) {
    this.loanService.rejectLoan(loan).then((updatedLoan) => {
      console.log('Loan rejected:', updatedLoan);
      // Update the loans array in the component with the updated loan
      const index = this.loans.findIndex(l => l.id === updatedLoan.id);
      if (index !== -1) {
        this.loans[index] = updatedLoan;
        this.cdr.detectChanges(); // Trigger change detection after updating loans array
        window.location.reload();

      }
    }).catch(error => {
      console.error('Error rejecting loan:', error);
    });
  }
}