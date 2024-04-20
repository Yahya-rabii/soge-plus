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
  styleUrl: './cards.component.css'
})
export class CardsComponent {

  Loans: Loan[] = [];
  Contracts: Contract[] = [];
  Users : User[] = [];
  Accounts: Account[] = [];

  constructor(private contractService: ContractService, private userService: UsersService , private loanService: LoanService , private accountService: AccountService) { }

  ngOnInit(): void {
    this.getLoans();
    this.getContracts();
    this.getUsers();
    this.getAccounts();
  }

  getLoans(){
    this.loanService.getLoans().then((loans) => {
      this.Loans = loans;
    });
  }

  getContracts(){
    this.contractService.getContracts().then((contracts) => {
      this.Contracts = contracts;
    });
  }

  getUsers(){
    this.userService.getUsers().then((users) => {
      this.Users = users;
    });
  }

  getAccounts(){
    this.accountService.getAccounts().then((accounts) => {
      this.Accounts = accounts;
    });
  }



}
