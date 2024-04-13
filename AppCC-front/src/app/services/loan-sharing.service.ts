import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanSharingService {

  private loansSubject = new BehaviorSubject<Loan[]>([]);
  loans$ = this.loansSubject.asObservable();

  constructor() {
    // Retrieve loans data from sessionStorage when the service is initialized
    const loansFromStorage = sessionStorage.getItem('loans');
    if (loansFromStorage) {
      this.loansSubject.next(JSON.parse(loansFromStorage));
    }
  }

  setLoans(loans: Loan[]): void {
    this.loansSubject.next(loans);
    // Store loans data in sessionStorage
    sessionStorage.setItem('loans', JSON.stringify(loans));
  }

  async getLoans(): Promise<Loan[]> {
    return new Promise<Loan[]>((resolve, reject) => {
      const loans = this.loansSubject.getValue();
      if (loans && loans.length > 0) {
        resolve(loans);
      } else {
        reject(new Error('No loans available'));
      }
    });
  }
}
