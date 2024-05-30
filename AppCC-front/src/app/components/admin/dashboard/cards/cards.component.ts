import { Component } from '@angular/core';
import { Loan } from '../../../../models/loan.model';
import { Contract } from '../../../../models/contract.model';
import { User } from '../../../../models/user.model';
import { Account } from '../../../../models/account.model';
import { ContractService } from '../../../../services/contract.service';
import { UsersService } from '../../../../services/user.service';
import { LoanService } from '../../../../services/loan.service';
import { AccountService } from '../../../../services/account.service';
@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent {
  Loans: Loan[] = [];
  Contracts: Contract[] = [];
  Users: User[] = [];
  Accounts: Account[] = [];
  LoansCountcnt: number = 0;
  ContractsCountcnt: number = 0;
  UsersCountcnt: number = 0;
  AccontsCountcnt: number = 0;
  constructor(
    private contractService: ContractService,
    private userService: UsersService,
    private loanService: LoanService,
    private accountService: AccountService,
  ) {}
  ngOnInit(): void {
    this.getLoans();
    this.getContracts();
    this.getUsers();
    this.getAccounts();
  }
  getLoans() {
    this.loanService.getLoans().then((loans) => {
      this.Loans = loans;
    });
  }
  getContracts() {
    this.contractService.getContracts().then((contracts) => {
      this.Contracts = contracts;
    });
  }
  getUsers() {
    this.userService.getUsers().then((users) => {
      this.Users = users;
    });
  }
  getAccounts() {
    this.accountService.getAccounts().then((data) => {
      if (data.Accounts) {
        this.Accounts = data.Accounts;
      } else {
        this.Accounts = [];
      }
    });
  }
  AccountsCount() {
    this.AccontsCountcnt = 0;
    for (let account of this.Accounts) {
      this.AccontsCountcnt++;
    }
    return this.AccontsCountcnt;
  }
  LoansCount() {
    this.LoansCountcnt = 0;
    for (let loan of this.Loans) {
      this.LoansCountcnt++;
    }
    return this.LoansCountcnt;
  }
  ContractsCount() {
    this.ContractsCountcnt = 0;
    for (let contract of this.Contracts) {
      this.ContractsCountcnt++;
    }
    return this.ContractsCountcnt;
  }
  UsersCount() {
    this.UsersCountcnt = 0;
    for (let user of this.Users) {
      this.UsersCountcnt++;
    }
    return this.UsersCountcnt;
  }
}
