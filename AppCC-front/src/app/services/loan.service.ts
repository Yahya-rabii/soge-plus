import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor() { }

  Loans: Loan[] = [];

  async getLoans(): Promise<Loan[]> {
    const url = `${environment.LoanMsUrl}${environment.getAllLoansEndpoint}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const Loans: Loan[] = data.map((loanData: any) => {
        // Assuming your Loan model has appropriate constructor
        return new Loan(
          loanData.amount,
          loanData.type,
          loanData.paymentDuration,
          loanData.status,
          loanData.approved,
          loanData.cinNumber,
          loanData.taxId,
          loanData.receptionMethod,
          loanData.bankAccountCredentials_RIB,
          loanData.selectedAgency,
          new Date(loanData.loanCreationDate).toISOString(), // Convert to string
          loanData.clientId,
          loanData.signature, // Assuming the signature is already a base64 string
          loanData.cinCartRecto, // Assuming cinCartRecto is already a base64 string
          loanData.cinCartVerso // Assuming cinCartVerso is already a base64 string
        );
      });
      console.log('Loans:', Loans);
      return Loans;
    } catch (error) {
      console.error('Error fetching Loans:', error);
      throw error;
    }
  }


  async getLoansByClientId():   Promise<Loan[]> {
    const clientId = localStorage.getItem('UserId');
    const url = `${environment.LoanMsUrl}${environment.getLoansByClientIdEndpoint}${clientId}`;
    try {
      const response = await fetch(url);
      const data = await response.json();      
      this.Loans = [];
      //loop over the data and create a table of loans
      for (let i = 0; i < data.length; i++) {
        this.Loans.push(new Loan(
          data[i].amount,
          data[i].type,
          data[i].paymentDuration,
          data[i].status,
          data[i].approved,
          data[i].signature,
          data[i].cinCartRecto,
          data[i].cinCartVerso,
          data[i].cinNumber,
          data[i].taxId,
          data[i].receptionMethod,
          data[i].bankAccountCredentials_RIB,
          data[i].selectedAgency,
          data[i].loanCreationDate,
          data[i].clientId,
         
        ));
      }

      return this.Loans;

    } catch (error) {
      console.error('Error fetching Loan:', error);
      throw error;
    }
  }
  

  async createLoan(loan: Loan): Promise<any> {
    const url = `${environment.LoanMsUrl}${environment.createLoanEndpoint}`;
  
    const formData = new FormData();
    formData.append('amount', loan.amount.toString());
    formData.append('type', loan.type);
    formData.append('paymentDuration', loan.paymentDuration);
    formData.append('cinNumber', loan.cinNumber);
    formData.append('taxId', loan.taxId);
    formData.append('receptionMethod', loan.receptionMethod);
    formData.append('bankAccountCredentials_RIB', loan.bankAccountCredentials_RIB);
    formData.append('selectedAgency', loan.selectedAgency);
    formData.append('loanCreationDate', loan.loanCreationDate.toISOString());
    formData.append('clientId', loan.clientId);
    formData.append('signature', loan.get_signature() || '');
    formData.append('cinCartRecto', loan.get_cinCartFont() || '');
    formData.append('cinCartVerso', loan.get_cinCartBack() || '');
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Loan created:', data);
      return data;
    } catch (error) {
      console.error('Error creating Loan:', error);
      throw error;
    }
  }
  

}
