import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../../services/user.service';
import { User } from '../../../../../models/user.model';
import { LoanService } from '../../../../../services/loan.service';
import { Loan } from '../../../../../models/loan.model';
import { LoanSharingService } from '../../../../../services/loan-sharing.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-loans-requests',
  templateUrl: './users-loans-requests.component.html',
  styleUrls: ['./users-loans-requests.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LoansRequestsComponent implements OnInit {

  users: User[] = [];
  loans: Loan[] = [];

  constructor(
    private router: Router,
    private usersService: UsersService,
    private loanService: LoanService,
    private loanSharingService: LoanSharingService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().then(
      (users) => this.users = users
    );
  }

  displayloans(id: string): void {
    this.loanService.getLoansByClientId(id).then(
      (loans) => {
        this.loans = loans;
        // Set the loans data in the shared service
        this.loanSharingService.setLoans(this.loans);

        // store the user id in the session storage
        sessionStorage.setItem('UserId', id);

        // Navigate to the LoansOfUserComponent
        this.router.navigate(['/loans-of-user']);
      }
    ).catch(error => {
      console.error('Error fetching loans:', error);
    });
  }
}
