import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor() { }

  Loans : Loan[] = [];

  
  async getLoans(): Promise<Loan[]> {
    const url = `${environment.LoanMsUrl}${environment.getAllLoansEndpoint}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const Loans: Loan[] = data.map((loanData: { amount: number | undefined; type: string | undefined; paymentDuration: string | undefined; status: string | undefined; approuved: boolean | undefined; signature: string | undefined; cinCartRecto: string | undefined; cinCartVerso: string | undefined; cinNumber: string | undefined; taxId: string | undefined; receptionMethod: string | undefined; bankAccountCredentials_RIB: string | undefined; selectedAgency: string | undefined; loanCreationDate: Date | undefined; clientId: string | undefined; }) => new Loan(loanData.amount, loanData.type, loanData.paymentDuration, loanData.status, loanData.approuved, loanData.signature, loanData.cinCartRecto, loanData.cinCartVerso, loanData.cinNumber, loanData.taxId, loanData.receptionMethod, loanData.bankAccountCredentials_RIB, loanData.selectedAgency, loanData.loanCreationDate, loanData.clientId));
      console.log('Loans:', Loans);
      return Loans;
    } catch (error) {
      console.error('Error fetching Loans:', error);
      throw error;
    }
  }


  // createLoan
  async createLoan(Loan: Loan): Promise<Loan> {
    const url = `${environment.LoanMsUrl}${environment.createLoanEndpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Loan)
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
