import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Loan } from '../../../../models/loan.model';
import { LoanSharingService } from '../../../../services/loan-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanDetailsImageComponent } from './loan-details-dialog/loan-details-image.component';
import { LoanService } from '../../../../services/loan.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-loans-of-user',
  templateUrl: './loans-of-user.component.html',
  styleUrls: ['./loans-of-user.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class LoansOfUserComponent implements OnInit {
  loans: Loan[] = [];
  dialogRef: any;
  openFabIndex: number | null = null;
  loading: boolean = false;
  constructor(
    private loanSharingService: LoanSharingService,
    private dialog: MatDialog,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.getLoans(userId);
    }
  }
  getLoans(userId: string): void {
    this.loans = this.loanSharingService.getLoans();
    if (this.loans.length === 0) {
      this.loanService
        .getLoansByClientId(userId)
        .then((loans) => {
          this.loans = loans;
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Error fetching loans:', error);
        });
    } else {
      this.cdr.detectChanges();
    }
  }
  openDialog(file: File): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(LoanDetailsImageComponent, {
      width: '500px',
      data: { Image: file },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }
  approveLoan(loan: Loan) {
    this.loading = true;
    this.loanService
      .approveLoan(loan)
      .then((updatedLoan) => {
        const index = this.loans.findIndex((l) => l.id === updatedLoan.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
          this.cdr.detectChanges();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error approving loan:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
  rejectLoan(loan: Loan) {
    this.loading = true;
    this.loanService
      .rejectLoan(loan)
      .then((updatedLoan) => {
        const index = this.loans.findIndex((l) => l.id === updatedLoan.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
          this.cdr.detectChanges();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error rejecting loan:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
  toggleSpeedDial(index: number): void {
    if (this.openFabIndex === index) {
      this.openFabIndex = null;
    } else {
      this.openFabIndex = index;
    }
  }
}
