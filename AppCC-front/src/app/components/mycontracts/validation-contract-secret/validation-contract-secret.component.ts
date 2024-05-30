import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ContractService } from '../../../services/contract.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-validation-contract-secret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation-contract-secret.component.html',
  styleUrls: ['./validation-contract-secret.component.css'],
})
export class ValidationContractSecretComponent implements OnInit {
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  @ViewChild('input6') input6!: ElementRef;
  secret1: string = '';
  secret2: string = '';
  secret3: string = '';
  secret4: string = '';
  secret5: string = '';
  secret6: string = '';
  verificationResult: boolean | null = null;
  timer: any;
  timerValue: number = 60;
  constructor(
    private contractService: ContractService,
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.startTimer();
  }
  onSubmit() {
    const secret =
      this.secret1 +
      this.secret2 +
      this.secret3 +
      this.secret4 +
      this.secret5 +
      this.secret6;
    this.validateSecret(secret);
  }
  validateSecret(secret: string) {
    this.verificationResult = null;
    this.contractService
      .verifySecret(secret)
      .then((response) => {
        this.verificationResult = response;
        if (response) {
          this.dialog.closeAll();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error validating secret:', error);
      });
  }
  onCloseClick(): void {
    this.dialog.closeAll();
  }
  focusNextInput(
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement | null,
  ) {
    const inputValue = currentInput.value;
    if (inputValue.length === 1 && nextInput) {
      nextInput.focus();
    }
  }
  focusPreviousInput(
    currentInput: HTMLInputElement,
    previousInput: HTMLInputElement | null,
  ) {
    if (previousInput) {
      previousInput.focus();
    }
  }
  allowInputAfterDeletion(currentInput: HTMLInputElement) {
    if (!currentInput.value) {
      setTimeout(() => {
        currentInput.focus();
      }, 0);
    }
  }
  startTimer() {
    this.timer = setInterval(() => {
      if (this.timerValue > 0) {
        this.timerValue--;
      }
    }, 1000);
  }
  resendCode() {
    clearInterval(this.timer);
    this.timerValue = 60;
    this.startTimer();
  }
  get timerMinutes(): string {
    const minutes = Math.floor(this.timerValue / 60);
    return minutes < 10 ? '0' + minutes : minutes.toString();
  }
  get timerSeconds(): string {
    const seconds = this.timerValue % 60;
    return seconds < 10 ? '0' + seconds : seconds.toString();
  }
}
