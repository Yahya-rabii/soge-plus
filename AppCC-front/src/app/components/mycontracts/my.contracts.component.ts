import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { Contract } from '../../models/contract.model';
import { from } from 'rxjs';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ValidationContractSecretComponent } from '../../validation-contract-secret/validation-contract-secret.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my.contracts.component.html',
  styleUrl: './my.contracts.component.css',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('out', style({
        height: '0', 
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})

export class MyContractsComponent implements OnInit {
  openContracts: number[] = []; // Array to track indices of opened contracts

  constructor(private contractService: ContractService , private userService :UsersService , private dialog: MatDialog) { }

  toggleContract(index: number){
    if(this.openContracts.includes(index)){
      this.openContracts = this.openContracts.filter(i => i !== index); // Close the clicked contract if already open
    } else {
      this.openContracts.push(index); // Open the clicked contract
    }
  }

  isContractOpen(index: number): boolean {
    return this.openContracts.includes(index); // Check if the contract at the given index is open
  }

  ngOnInit(): void {
    this.getContracts();
  }

  contracts : Contract[] = [];
  users : User[] = [];
 
  getContracts(){
    // Loop over all users and get their contracts 
    from(this.userService.getUsers()).subscribe((data) => {
      const userid :string = localStorage.getItem('UserId') || '';
      this.contractService.getContractsOfClient(userid).then((data) => {
        if (data) {
          this.contracts = data.contracts;
        }
        else {
          this.contracts = [];
        }
      });
    });
  }

  signContract(contractId: Number){
    this.contractService.signContract(contractId).then((data) => {
      if (data) {
        this.openDialog();
      }
    });
  }
  dialogRef: any; // Reference to the dialog

  openDialog(): void {
    // Close any existing dialog before opening a new one
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    // Open new dialog
    this.dialogRef = this.dialog.open(ValidationContractSecretComponent, {
      width: '500px',
      data: {},
    });

    // Handle dialog close event
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null; // Reset dialog reference
    });
  }

}
