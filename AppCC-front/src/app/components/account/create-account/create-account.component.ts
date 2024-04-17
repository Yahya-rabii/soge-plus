import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {

  constructor(private accountService: AccountService) { }

  // Method to set the account type when a button is clicked
  public setAccountType(accountType: string) {
    // Set the account type value in the form
    const accountTypeControl = document.getElementById('accountType') as HTMLInputElement;
    if (accountTypeControl) {
      accountTypeControl.value = accountType;
    }
  }

  // Method to handle form submission
  public Submit() {
    const formData = {
      accountType: (document.getElementById('accountType') as HTMLInputElement)?.value ?? '',
      accountHolderId: this.getAccountHolderIdFromLocalStorage(),
      balance: 0,
      bankName: 'SOGE Bank'
    };

    const account : Account = new Account(
      0,
      this.generateRIB(),
      formData.accountType,
      formData.accountHolderId,
      0,
      []
    );

    // Call the service to create an account
    this.accountService.createAccount(account).then(() => {
      alert('Account created successfully');
    });
  }

  // Method to get account holder ID from local storage
  public getAccountHolderIdFromLocalStorage(): string {
    return localStorage.getItem('UserId') ?? '';
  }

  // Method to create a 16-digit random RIB number
  public generateRIB(): string {
    return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
  }
}
