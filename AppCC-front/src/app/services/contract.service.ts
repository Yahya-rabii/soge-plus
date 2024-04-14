import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() { }

  async getContractsOfClient(): Promise<any> {

    const clientId = localStorage.getItem('UserId');
    const url = `${environment.ContractMsUrl}${environment.getContractsOfClientEndpoint}${clientId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
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
