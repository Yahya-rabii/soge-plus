import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Account } from '../models/account.model';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor() { }


    // get Accounts of all clients 
    async getAccounts(): Promise<any> {
        const url = `${environment.AccountMsUrl}${environment.getAllAccountsEndpoint}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Accounts:', error);
            throw error;
        }
    }

    // get Account by client id

    async getAccountByHolderId(): Promise<any> {
        const id = localStorage.getItem('UserId');
        const url = `${environment.AccountMsUrl}${environment.getAccountByAccountHolderIdEndpoint}/${id}`;
        try {
            const response = await fetch(url);

            // Check if response status is ok
            if (!response.ok) {
                throw new Error(`Failed to fetch Account: ${response.status} ${response.statusText}`);
            }

            // Check if response body is empty
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

    // create Account
    async createAccount(account: Account): Promise<any> {
        console.log(account);
        const url = `${environment.AccountMsUrl}${environment.createAccountEndpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(account)
            });
            const data = await response.json();
            const newaccount : Account = new Account(data.id, data.accountHolderId, data.balance, data.currency, data.type, data.status);
            return newaccount;
        } catch (error) {
            console.error('Error creating Account:', error);
            throw error;
        }
    }
    
    async addBeneficiary(accountId: number, beneficiaryRIB: number): Promise<any> {
        const url = `${environment.AccountMsUrl}/beneficiary/${accountId}`;
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(beneficiaryRIB) // Sending the RIB directly as the request body
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding Beneficiary:', error);
            throw error;
        }

    }
    
}
