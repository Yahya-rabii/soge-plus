import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../services/contract.service';
import { Contract } from '../../../models/contract.model';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
  animations: [
    trigger('slideDownUp', [
      state('in', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('out', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in => out', [
        animate('4000ms ease-out')
      ]),
      transition('out => in', [
        animate('400ms ease-in')
      ]),
    ])
  ]
})
export class ContractsComponent implements OnInit {
  usersWithContracts: { user: User, contracts: Contract[], isOpen: boolean }[] = [];
  users: User[] = [];
  contracts: Contract[] = [];

  constructor(private contractService: ContractService, private userService: UsersService) { }

  ngOnInit(): void {
    this.getContracts();
  }

  toggleDetails(index: number) {
    this.usersWithContracts[index].isOpen = !this.usersWithContracts[index].isOpen;
  }

  getContracts() {
    this.userService.getUsers().then((data) => {
      this.users = data;

      for (const user of this.users) {
        this.contractService.getContractsOfClient(user.id).then((data) => {
          this.contracts = data.contracts;
          this.usersWithContracts.push({ user, contracts: this.contracts, isOpen: false });
        });
      }
    });
  }
}
