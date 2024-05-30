import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Loan } from '../models/loan.model';
@Injectable({
  providedIn: 'root',
})
export class LoanSharingService {
  private loansSubject = new BehaviorSubject<Loan[]>([]);
  loans$ = this.loansSubject.asObservable();
  constructor() {}
  setLoans(loans: Loan[]): void {
    this.loansSubject.next(loans);
  }
  getLoans(): Loan[] {
    return this.loansSubject.getValue();
  }
}
