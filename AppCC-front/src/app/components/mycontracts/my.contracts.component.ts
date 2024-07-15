import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { Contract } from '../../models/contract.model';
import { from } from 'rxjs';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ValidationContractSecretComponent } from './validation-contract-secret/validation-contract-secret.component';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my.contracts.component.html',
  styleUrls: ['./my.contracts.component.css'],
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
          height: '0',
          opacity: 0,
          overflow: 'hidden',
        }),
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class MyContractsComponent implements OnInit, OnDestroy {
  openContracts: number[] = [];
  signingContract: boolean = false;
  countdownTimer: number = 0;
  countdownInterval: any;
  contracts: Contract[] = [];
  users: User[] = [];
  constructor(
    private contractService: ContractService,
    private userService: UsersService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private cookieService: CookieService,
  ) {}
  toggleContract(index: number) {
    if (this.openContracts.includes(index)) {
      this.openContracts = this.openContracts.filter((i) => i !== index);
    } else {
      this.openContracts.push(index);
    }
  }
  isContractOpen(index: number): boolean {
    return this.openContracts.includes(index);
  }
  ngOnInit(): void {
    this.getMyContracts();
    this.loadCountdownTimer();
    this.checkAndDisableButton();
  }
  ngOnDestroy(): void {
    this.clearCountdownInterval();
  }
  getMyContracts() {
    const userId= this.authService.getUserId();
    this.contractService.getContractsOfClient(userId).then((data) => {
      if (data) {
        this.contracts = data.contracts;
      }
    });
  }
  signContract(contractId: Number) {
    this.signingContract = true;
    this.startCountdownTimer();
    this.contractService.signContract(contractId).then((data) => {
      if (data) {
        this.openDialog();
      }
    });
  }
  dialogRef: any;
  openDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(ValidationContractSecretComponent, {
      width: '500px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }
  startCountdownTimer() {
    this.countdownTimer = 60;
    this.countdownInterval = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        this.clearCountdownInterval();
        this.signingContract = false;
        this.cookieService.delete('countdownTimer');
      } else {
        this.cookieService.set(
          'countdownTimer',
          this.countdownTimer.toString(),
          1,
          '/',
          '',
          false,
          'Strict',
        );
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
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  checkAndDisableButton() {
    const storedCountdownTimer = this.cookieService.get('countdownTimer');
    if (storedCountdownTimer && parseInt(storedCountdownTimer, 10) > 0) {
      this.signingContract = true;
    }
  }
}
