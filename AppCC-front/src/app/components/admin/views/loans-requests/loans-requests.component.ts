import { Component } from '@angular/core';
import { LoanService } from '../../../../services/loan.service';
import { Loan } from '../../../../models/loan.model';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-loans-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loans-requests.component.html',
  styleUrl: './loans-requests.component.css'
})
export class LoansRequestsComponent implements OnInit {

  constructor(private loanService : LoanService){}

  loans : Loan[] = []
  
  getloans() : void{

    this.loanService.getLoans().then(
       (loans) => this.loans = loans 

    );
  }

  ngOnInit(): void {
    this.getloans();
  }


}
