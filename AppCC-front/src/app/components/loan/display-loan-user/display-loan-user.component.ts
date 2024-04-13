import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../../services/loan.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanDetailsDialogComponent } from './loan-details-dialog/loan-details-dialog.component';
import { Loan } from '../../../models/loan.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-loan-user',
  templateUrl: './display-loan-user.component.html',
  styleUrls: ['./display-loan-user.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DisplayLoanUserComponent implements OnInit {
  loans: Loan[] = [];
  pagedLoans: Loan[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  dialogRef: any; // Reference to the dialog

  constructor(private loanService: LoanService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loanService.getLoansByClientId('').then((loans) => {
      this.loans = loans;
      this.setPage(1);
    });
  }

  // Open dialog with loan details
  openDialog(loan: Loan): void {
    // Close any existing dialog before opening a new one
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    // Open new dialog
    this.dialogRef = this.dialog.open(LoanDetailsDialogComponent, {
      width: '500px',
      data: { loan: loan },
    });

    // Handle dialog close event
    this.dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.dialogRef = null; // Reset dialog reference
    });
  }

  // Set loans for current page
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.loans.length);
    this.pagedLoans = this.loans.slice(startIndex, endIndex);
  }

  // Change page
  changePage(page: number) {
    this.setPage(page);
  }

  // Generate page numbers for pagination
  get pageNumbers(): number[] {
    return Array(Math.ceil(this.loans.length / this.pageSize)).fill(0).map((x, i) => i + 1);
  }
}
