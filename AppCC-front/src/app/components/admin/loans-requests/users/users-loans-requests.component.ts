import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { LoanService } from '../../../../services/loan.service';
import { Loan } from '../../../../models/loan.model';
import { LoanSharingService } from '../../../../services/loan-sharing.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-users-loans-requests',
  templateUrl: './users-loans-requests.component.html',
  styleUrls: ['./users-loans-requests.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LoansRequestsComponent implements OnInit {
  clients: User[] = [];
  clientsWithLoans: User[] = [];
  constructor(
    private router: Router,
    private usersService: UsersService,
    private loanService: LoanService,
    private loanSharingService: LoanSharingService,
  ) {}
  ngOnInit(): void {
    this.getClients();
  }
  getClients(): void {
    this.usersService.getUsers().then((clients) => {
      this.clients = clients;
      if (this.clients.length > 0) {
        this.clients.forEach((client) => {
          this.getLoansForUser(client.id);
        });
      }
    });
  }
  getLoansForUser(userId: string): void {
    this.loanService.getLoansByClientId(userId).then((loans) => {
      if (loans.length > 0) {
        const user = this.clients.find((u) => u.id === userId);
        if (user) {
          this.clientsWithLoans.push(user);
        }
      }
    });
  }
  displayLoans(userId: string): void {
    this.loanService
      .getLoansByClientId(userId)
      .then((loans) => {
        this.loanSharingService.setLoans(loans);
        this.router.navigate(['/admin/loans-of-user', { userId }]).then();
      })
      .catch((error) => {
        console.error('Error fetching loans:', error);
      });
  }
}
