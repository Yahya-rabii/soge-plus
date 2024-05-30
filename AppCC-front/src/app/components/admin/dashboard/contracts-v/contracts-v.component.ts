import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ContractService } from '../../../../services/contract.service';
import { Contract } from '../../../../models/contract.model';
import { Loan } from '../../../../models/loan.model';
import { User } from '../../../../models/user.model';
import { LoanService } from '../../../../services/loan.service';
import { UsersService } from '../../../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contracts-v',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts-v.component.html',
  styleUrls: ['./contracts-v.component.css'],
})
export class ContractsVComponent implements OnInit {
  eventDate: any = formatDate(new Date(), 'MMM dd, yyyy', 'en');
  contracts: Contract[] = [];
  composedObjects: any[] = [];

  constructor(
    private contractService: ContractService,
    private loanService: LoanService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.getContracts();
  }

  getContracts() {
    this.contractService.getContracts().then((contracts) => {
      if (contracts) {
        this.contracts = contracts;
        this.getComposedObjects();
      } else {
        console.log('No contracts found');
      }
    });
  }

  getComposedObjects() {
    this.composedObjects = [];
    this.contracts.forEach((contract) => {
      forkJoin({
        loan: this.loanService.getLoanById(contract.loanId),
        user: this.userService.getUserById(contract.clientId),
      }).subscribe(
        ({ loan, user }) => {
          this.composedObjects.push({ contract, loan, user });
        },
        (error) => {
          console.error('Error fetching loan or user:', error);
        }
      );
    });
  }
}
