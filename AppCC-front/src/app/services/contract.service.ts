import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Contract } from '../models/contract.model';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private authService: AuthenticationService) {}
  async getAllContracts(): Promise<any> {
    const url = `${environment.ContractMsUrl}${environment.getAllContractsEndpoint}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
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
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      console.log('response status', response.status);
      if (response.status == 204) {
        return new Array<Contract>();
      }
      if (!response.ok) {
        console.error('Error fetching Contracts:', response.statusText);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Contracts:', error);
      throw error;
    }
  }
  async getContracts(): Promise<Contract[]> {
    const url = `${environment.ContractMsUrl}${environment.getAllContractsEndpoint}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (response.status == 204) {
        return new Array<Contract>();
      }
      if (response.ok) {
        const data = await response.json();
        return data.contracts;
      } else {
        console.error('Error fetching Contracts:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Contracts:', error);
      throw error;
    }
  }
  async signContract(contractId: Number): Promise<any> {
    const url = `${environment.ContractMsUrl}${environment.signContractEndpoint}${contractId}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        method: 'POST',
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
  async verifySecret(secret: string): Promise<any> {
    const UserId = this.authService.getUserId();
    const url = `${environment.ContractMsUrl}${environment.verifySecretEndpoint}${UserId}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        method: 'POST',
        body: secret,
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
