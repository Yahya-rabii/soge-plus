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
  accountType : string = '';
  // Method to set the account type when a button is clicked
  public setAccountType(accountType: string) {
    this.accountType = accountType;
  }

  // Method to handle form submission
  public Submit() {
    const formData = {
      accountType: this.accountType,
      accountHolderId: this.getAccountHolderIdFromLocalStorage(),
      balance: 0,
      bankName: 'SOGE Bank'
    };

    const account : Account = new Account(
      0,
      this.generateRib(),
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

  // Method to create a 16-digit random Rib number
  public generateRib(): string {
    return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
  }
}
