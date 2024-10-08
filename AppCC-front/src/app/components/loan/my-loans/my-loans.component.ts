import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../../services/loan.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanDetailsDialogComponent } from '../loan-details-dialog/loan-details-dialog.component';
import { Loan } from '../../../models/loan.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';
@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-loans.component.html',
  styleUrl: './my-loans.component.css',
})
export class MyLoansComponent implements OnInit {
  loans: Loan[] = [];
  pagedLoans: Loan[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  dialogRef: any;
  constructor(
    private loanService: LoanService,
    private dialog: MatDialog,
    private userService: UsersService,
    private authService: AuthenticationService,
  ) {}
  user: User = new User();
  getUser() {
    try {
      const userid: string = this.authService.getUserId();
      this.userService.getUserById(userid).then((user) => {
        if (user) {
          this.user = user;
          this.loanService.getLoansByClientId(user.id).then((loans) => {
            this.loans = loans;
            this.setPage(1);
          });
        }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  ngOnInit(): void {
    this.getUser();
  }
  openDialog(loan: Loan): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(LoanDetailsDialogComponent, {
      width: '500px',
      data: { loan: loan },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.loans.length);
    this.pagedLoans = this.loans.slice(startIndex, endIndex);
  }
  changePage(page: number) {
    this.setPage(page);
  }
  get pageNumbers(): number[] {
    return Array(Math.ceil(this.loans.length / this.pageSize))
      .fill(0)
      .map((x, i) => i + 1);
  }
}
