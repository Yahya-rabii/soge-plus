import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { Transaction} from '../../../../models/transaction.model';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatIconModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{

  beneficiary: User = new User();
  transactions: Transaction[] = [];
  rib: string = ''; // Change the type to string to handle the spaces

  constructor( private router: Router , private accountService: AccountService) {

  }
  
  ngOnInit() {
    this.getTransactions();
  }

  //get transactions
  getTransactions(){
    this.accountService.getTransactions().then((data) => {
      this.transactions = data;
    }).catch((error) => {
      console.error('Error getting transactions:', error);
    });
  }
  
}
