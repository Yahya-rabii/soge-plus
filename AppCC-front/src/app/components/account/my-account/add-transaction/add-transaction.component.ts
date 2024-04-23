import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { Account } from '../../../../models/account.model';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatIconModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent implements OnInit{

  addTransactionForm: FormGroup;
  beneficiary: User = new User();
  account: Account = new Account();
  rib: string = ''; // Change the type to string to handle the spaces
  amount: number = 0;

  constructor(private formBuilder: FormBuilder, private router: Router , private accountService: AccountService) {
    this.addTransactionForm = this.formBuilder.group({
      // rib is not a string, it is a number of 16 digits
      rib: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]], // Update minimum length to 16
      amount: ['', [Validators.required]]
    });
    
  }
  
  ngOnInit() {
    this.getAccountByHolderId();
  }

  public getAccountByHolderId() {



    this.accountService.getAccountByHolderId().then((data) => {
      this.account = data.Account;
    });
  }

  

  // Method to handle form submission
  public async Submit() {
    // Fetch accounts first
    this.getAccountByHolderId();

    // remove spaces from the addbeneficiary form rib
    this.addTransactionForm.patchValue({ rib: this.addTransactionForm.value.rib.replace(/\s/g, '')  , amount: this.addTransactionForm.value.amount});
    // Check form validity after fetching accounts
    if (this.addTransactionForm.invalid) {
      console.log('Form validity:', this.addTransactionForm.valid); // Add this line
      console.log('Form value:', this.addTransactionForm.value); // Add this line
      alert('Please enter valid details');
      return;
    }
  
    const formData = this.addTransactionForm.value;
    this.rib = formData.rib.replace(/\s/g, ''); // Remove any existing spaces
    this.amount = formData.amount;
    // Call the service to add a beneficiary
    if (this.account) {
      this.accountService.addTransaction(this.account.id , Number(this.rib) , Number(this.amount)).then(() => {
        alert('Transaction sent successfully');
        this.router.navigate(['/transactions']);
      });
    }
  }
  
  // Function to add space after every four characters
  public formatRIB(event: any): void {
    let currentValue = event.target.value;
    currentValue = currentValue.replace(/\s/g, ''); // Remove existing spaces
    currentValue = currentValue.replace(/(\d{4})/g, '$1 ').trim(); // Add space after every four characters
    // stop the user to unter more after reachin 16 digits
    if (currentValue.length > 19) {
      currentValue = currentValue.substring(0, 19);
    }

    this.addTransactionForm.patchValue({ rib: currentValue });
    console.log('Formatted RIB:', currentValue);
  }

  contactus(){
    this.router.navigate(['/contact']);
  }
}
