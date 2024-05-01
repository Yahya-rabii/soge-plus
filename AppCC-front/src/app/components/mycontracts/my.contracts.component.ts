import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { Contract } from '../../models/contract.model';
import { from } from 'rxjs';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ValidationContractSecretComponent } from './validation-contract-secret/validation-contract-secret.component';

@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my.contracts.component.html',
  styleUrls: ['./my.contracts.component.css'],
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

export class MyContractsComponent implements OnInit, OnDestroy {
  openContracts: number[] = []; // Array to track indices of opened contracts
  signingContract: boolean = false; // Track whether the contract signing process is in progress
  countdownTimer: number = 0; // Countdown timer for 1 minute
  countdownInterval: any; // Interval reference for countdown timer

  constructor(private contractService: ContractService,
              private userService: UsersService,
              private dialog: MatDialog,
              private cookieService: CookieService) { }

  toggleContract(index: number) {
    if (this.openContracts.includes(index)) {
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
    this.loadCountdownTimer();
    this.checkAndDisableButton(); // Check if the button should be disabled when component is loaded
  }

  ngOnDestroy(): void {
    this.clearCountdownInterval(); // Clear countdown interval when component is destroyed
  }

  contracts: Contract[] = [];
  users: User[] = [];

  getContracts() {
    // Loop over all users and get their contracts 
    from(this.userService.getUsers()).subscribe((data) => {
      const userid: string = localStorage.getItem('UserId') || '';
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

  signContract(contractId: Number) {
    // Disable button and start countdown timer
    this.signingContract = true;
    this.startCountdownTimer();

    this.contractService.signContract(contractId).then((data) => {
      if (data) {
        this.openDialog();
      }
    });
  }

  dialogRef: any; // Reference to the dialog opened


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

  // Countdown timer logic
  startCountdownTimer() {
    this.countdownTimer = 60; // Reset countdown timer to 60 seconds
    this.countdownInterval = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        this.clearCountdownInterval(); // Stop the countdown timer
        this.signingContract = false; // Enable the button again after 1 minute
        this.cookieService.delete('countdownTimer'); // Delete the countdown cookie
      } else {
        this.cookieService.set('countdownTimer', this.countdownTimer.toString(), 1, '/', '', false, 'Strict'); // Set the countdown cookie
      }
    }, 1000);
  }

  loadCountdownTimer() {
    const storedCountdownTimer = this.cookieService.get('countdownTimer');

    if (storedCountdownTimer) {
      this.countdownTimer = parseInt(storedCountdownTimer, 10);
      if (this.countdownTimer > 0) {
        this.startCountdownTimer();
      }
    }
  }

  clearCountdownInterval() {
    // Clear the countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  checkAndDisableButton() {
    // Check if the countdown timer cookie exists and the timer is running
    const storedCountdownTimer = this.cookieService.get('countdownTimer');

    if (storedCountdownTimer && parseInt(storedCountdownTimer, 10) > 0) {
      this.signingContract = true; // Disable the button if the countdown timer is active
    }
  }
}
