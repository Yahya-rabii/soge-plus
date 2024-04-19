import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

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
    const url = `${environment.ContractMsUrl}${environment.getContractsOfClientEndpoint}/${clientId}`;
    try {
      const response = await fetch(url);
      
      // Log the response status and body
      const responseData = await response.text();
  
      // Parse response body if it's not empty
      const data = responseData ? JSON.parse(responseData) : null;
  
      // Check if data is empty
      if (!data) {
        throw new Error('Empty JSON response');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching Contracts:', error);
      throw error;
    }
  }
  
  

  // get contracts of all clients 
  async getContracts(): Promise<any> {
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
  

}
