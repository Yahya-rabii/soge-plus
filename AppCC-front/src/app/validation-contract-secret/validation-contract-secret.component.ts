import { Component, ElementRef, ViewChild } from '@angular/core';
import { ContractService } from '../services/contract.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
// ngModel
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-validation-contract-secret',
  standalone:true,
  imports: [CommonModule , FormsModule],
  templateUrl: './validation-contract-secret.component.html',
  styleUrls: ['./validation-contract-secret.component.css']
})

export class ValidationContractSecretComponent {
  @ViewChild('input1') input1!: ElementRef; // Reference to the first input field
  @ViewChild('input2') input2!: ElementRef; // Reference to the second input field
  @ViewChild('input3') input3!: ElementRef; // Reference to the third input field
  @ViewChild('input4') input4!: ElementRef; // Reference to the fourth input field
  @ViewChild('input5') input5!: ElementRef; // Reference to the fifth input field
  @ViewChild('input6') input6!: ElementRef; // Reference to the sixth input field

  secret1: string = ''; // Variable to store the first digit of the secret
  secret2: string = ''; // Variable to store the second digit of the secret
  secret3: string = ''; // Variable to store the third digit of the secret
  secret4: string = ''; // Variable to store the fourth digit of the secret
  secret5: string = ''; // Variable to store the fifth digit of the secret
  secret6: string = ''; // Variable to store the sixth digit of the secret

  constructor(private contractService: ContractService, private dialog: MatDialog) {}

  onSubmit() {
    // Concatenate all digits to form the complete secret
    const secret = this.secret1 + this.secret2 + this.secret3 + this.secret4 + this.secret5 + this.secret6;
    // Send the complete secret to the validateSecret method
    this.validateSecret(secret);
  }

  validateSecret(secret: string) {
    this.contractService.verifySecret(secret)
      .then((response) => {
        if (response) {
          this.onCloseClick();
        } else {
          alert('The secret is incorrect');
        }
      })
      .catch((error) => {
        console.error('Error validating secret:', error);
      });
  }

  onCloseClick(): void {
    this.dialog.closeAll();
  }

  // Focus on the next input field when a digit is entered
  focusNextInput(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    const inputValue = currentInput.value;
    if (inputValue.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  // Focus on the previous input field when a digit is deleted
  focusPreviousInput(currentInput: HTMLInputElement, previousInput: HTMLInputElement | null) {
    if (previousInput) {
      previousInput.focus();
    }
  }

  // Allow the user to enter another digit immediately after deleting one
  allowInputAfterDeletion(currentInput: HTMLInputElement) {
    // Check if the input field is empty after deletion
    if (!currentInput.value) {
      // If input is empty, focus on the current input field after a brief delay
      setTimeout(() => {
        currentInput.focus();
      }, 0);
    }
  }

  

  
  
  
  

}
