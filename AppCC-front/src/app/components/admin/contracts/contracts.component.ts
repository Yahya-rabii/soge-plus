import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../services/contract.service';
import { Contract } from '../../../models/contract.model';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
        }),
      ),
      state(
        'out',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        }),
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class ContractsComponent implements OnInit {
  usersWithContracts: { user: User; contracts: Contract[]; isOpen: boolean }[] =
    [];
  constructor(
    private contractService: ContractService,
    private userService: UsersService,
  ) {}
  ngOnInit(): void {
    this.getContracts();
  }
  toggleDetails(index: number) {
    this.usersWithContracts[index].isOpen =
      !this.usersWithContracts[index].isOpen;
  }
  getContracts() {
    this.userService.getUsers().then((users) => {
      users.forEach((user) => {
        this.contractService.getContractsOfClient(user.id).then((data) => {
          if (data.contracts.length > 0) {
            this.usersWithContracts.push({
              user,
              contracts: data.contracts,
              isOpen: false,
            });
          }
        });
      });
    });
  }
}
