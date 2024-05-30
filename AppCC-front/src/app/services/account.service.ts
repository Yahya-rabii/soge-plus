import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Account } from '../models/account.model';
import { Card } from '../models/card.model';
import { UsersService } from './user.service';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private userService: UsersService,
    private authService: AuthenticationService,
  ) {}
  async getAccounts(): Promise<any> {
    const url = `${environment.AccountMsUrl}${environment.getAllAccountsEndpoint}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Accounts: ${response.status} ${response.statusText}`,
        );
      } else {
        if (response.status === 204) {
          return [];
        }
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching Accounts:', error);
      throw error;
    }
  }
  async getAccountByHolderId(): Promise<any> {
    const id = this.authService.getUserId();
    const url = `${environment.AccountMsUrl}${environment.getAccountByAccountHolderIdEndpoint}/${id}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Account: ${response.status} ${response.statusText}`,
        );
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Empty or invalid response from server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Account:', error);
      throw error;
    }
  }
  async createAccount(
    account: Account,
    chosenImage: File,
    card: Card,
  ): Promise<any> {
    const url = `${environment.AccountMsUrl}${environment.createAccountEndpoint}`;
    try {
      const formData = new FormData();
      formData.append('account', JSON.stringify(account));
      formData.append('card', JSON.stringify(card));
      formData.append('chosenImage', chosenImage);
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, {
        headers,
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(
          `Failed to create Account: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      const newAccount: Account = new Account(
        data.id,
        data.accountHolderId,
        data.balance,
        data.currency,
        data.type,
        data.status,
      );
      return newAccount;
    } catch (error) {
      console.error('Error creating Account:', error);
      throw error;
    }
  }
  async addBeneficiary(
    accountId: number,
    beneficiaryRIB: number,
  ): Promise<any> {
    const url = `${environment.AccountMsUrl}/beneficiary/${accountId}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(beneficiaryRIB),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to add beneficiary: ${response.status} ${response.statusText}`,
        );
      }
      if (response.body === null) {
        return;
      }
      console.log(response);
      const data = await response.json();
      return data;
    } catch (error) {
      return;
    }
  }
  async addTransaction(
    accountId: number,
    rib: number,
    amount: number,
  ): Promise<any> {
    const url = `${environment.AccountMsUrl}${environment.addTransactionEndpoint}${accountId}/${rib}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(amount),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Transaction:', error);
      throw error;
    }
  }
  async getTransactions(): Promise<any> {
    const UserId = this.authService.getUserId();
    const url = `${environment.AccountMsUrl}${environment.getTransactionsEndpoint}${UserId}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Transactions: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error('Error fetching Transactions:', error);
      throw error;
    }
  }
  async getDeposits(): Promise<any> {
    const UserId = this.authService.getUserId();
    const url = `${environment.AccountMsUrl}${environment.getTransactionsEndpoint}${UserId}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Transactions: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data.addTransactions;
    } catch (error) {
      console.error('Error fetching Transactions:', error);
      throw error;
    }
  }
  async getWithdrawals(): Promise<any> {
    const UserId = this.authService.getUserId();
    const url = `${environment.AccountMsUrl}${environment.getTransactionsEndpoint}${UserId}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Transactions: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data.subTransactions;
    } catch (error) {
      console.error('Error fetching Transactions:', error);
      throw error;
    }
  }
  async hasAccount(): Promise<any> {
    const UserId: string = sessionStorage.getItem('UserId') || '';
    try {
      const user = await this.userService.getUserById(UserId);
      return user.hasAccount;
    } catch (error) {
      console.error('Error fetching User:', error);
      throw error;
    }
  }
}
