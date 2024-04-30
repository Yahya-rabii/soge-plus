import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../services/contract.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validation-contract-secret',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './validation-contract-secret.component.html',
  styleUrl: './validation-contract-secret.component.css'
})
export class ValidationContractSecretComponent {
  secret1: string = ''; // Variable to store the first digit of the secret
  secret2: string = ''; // Variable to store the second digit of the secret
  secret3: string = ''; // Variable to store the third digit of the secret
  secret4: string = ''; // Variable to store the fourth digit of the secret
  secret5: string = ''; // Variable to store the fifth digit of the secret
  secret6: string = ''; // Variable to store the sixth digit of the secret

  constructor(private contractService :  ContractService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { } , private router: Router) { }

  onSubmit() {
    // Concatenate all digits to form the complete secret
    const secret = this.secret1 + this.secret2 + this.secret3 + this.secret4 + this.secret5 + this.secret6;
    // Send the complete secret to the validateSecret method
    this.validateSecret(secret);
  }

  validateSecret(secret: string) {
    this.contractService.verifySecret(secret).then((response) => {
      if (response) {
        this.router.navigate(['/mycontracts']);
      } else {
        alert('The secret is incorrect');
      }
    }
    ).catch((error) => {
      console.error('Error validating secret:', error);
    });
  }






   
  openFabIndex: number | null = null; // Index of the opened FAB
  dialogRef: any // Reference to the dialog  
  


    onCloseClick(): void {
      this.dialogRef = this.dialog.closeAll();
    }

    // Open dialog with loan details
    // Open dialog with loan details
    openDialog(file: File): void {
      // Close any existing dialog before opening a new one
      if (this.dialogRef) {
          this.dialogRef.close(); // Close the image dialog
          // Reset dialog reference
          this.dialogRef = null;
      }


      // Handle dialog close event
      this.dialogRef.afterClosed().subscribe(() => {
          // Do not close the loan details dialog here
          // Reset dialog reference
          this.dialogRef = null;
      });
    }


    // Toggle visibility of the speed dial
    toggleSpeedDial(): void {
        this.openFabIndex = this.openFabIndex === null ? 0 : null;
    }





}
