import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Contract } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() { }

  async getContractsOfClients(): Promise<any> {

    const url = `${environment.ContractMsUrl}${environment.getAllContractsEndpoint}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Contracts:', error);
      throw error;
    }
  }

  async getContractsOfClient(clientId: string): Promise<any> {
    const url = `${environment.ContractMsUrl}${environment.getContractsOfClientEndpoint}${clientId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Error fetching Contracts:', response.statusText);
        return null
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching Contracts:', error);
      throw error;
    }
  }
  
  

  // get contracts of all clients 
  async getContracts(): Promise<Contract[]> {
    const url = `${environment.ContractMsUrl}${environment.getAllContractsEndpoint}`;
    try {
      const response = await fetch(url);
      if (response.status == 444) {
        return [];
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data);  
        return data.contracts;
      }
   
      else {
        console.error('Error fetching Contracts:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Contracts:', error);
      throw error;
    }
  }
  


  // sign Contract that takes the user id and generates a 6 digit random element like 1a2b3c and send it in the request body
  async signContract(contractId: Number): Promise<any> {
    let secret = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      secret += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    const url = `${environment.ContractMsUrl}${environment.signContractEndpoint}${contractId}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Set content type to text/plain
        },
        body: secret, // Pass the secret directly without JSON serialization
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error signing Contract:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error signing Contract:', error);
      throw error;
    }
  }
  

  //     verifySecret that takes the secret and gets the User id from the local storage and sends the secret in the request body
  
  async verifySecret(secret: string): Promise<any> {
    const UserId = localStorage.getItem('UserId');
    const url = `${environment.ContractMsUrl}${environment.verifySecretEndpoint}${UserId}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Set content type to text/plain
        },
        body: secret, // Pass the secret directly without JSON serialization
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error verifying secret:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error verifying secret:', error);
      throw error;
    }
  }
}
