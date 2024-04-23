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
  

}
