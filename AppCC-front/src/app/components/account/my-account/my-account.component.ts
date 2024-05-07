import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
import { Transaction } from '../../../models/transaction.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RibPipe } from '../../../pipes/rib.pipe';
import { BalancePipe } from '../../../pipes/balance.pipe';
import ApexCharts from 'apexcharts';
import { AddTransaction } from '../../../models/addtransaction.model';
import { SubTransaction } from '../../../models/subtransaction.model';
import { Card } from '../../../models/card.model';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, RibPipe, BalancePipe],
})
export class MyAccountComponent implements OnInit {
  @ViewChild('balanceChart', { static: true }) balanceChartRef!: ElementRef;

  constructor(private accountService: AccountService, private userService: UsersService) { }

  account: Account = new Account();
  client: User = new User();
  beneficiaries: User[] = [];
  deposits: AddTransaction[] = [];
  withdrawals: SubTransaction[] = [];
  currentDate = new Date();
  transactions: Transaction[] = []
  balanceVisible = false;
  balanceProgress: { balance: number; type: string }[] = [];
  initialBalance = 0;
  income = 0;
  stringMonth = '';
  async ngOnInit() {
    try {
      await this.getAccountByHolderId();
      await Promise.all([this.getDeposits(), this.getWithdrawals()]);
      this.getInitialBalance();
      this.calculateBalanceProgress();
      this.renderChart();
    } catch (error) {
      console.error('Error initializing account:', error);
    }
  }


  back: boolean = false;
  front : boolean = true;

  flipCard() {
    this.back = !this.back;
    this.front = !this.front;
  }
  


  async getDeposits() {
    try {
      this.deposits = await this.accountService.getDeposits();

      this.income = this.deposits.reduce((acc, deposit) => acc + deposit.amount, 0);

    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  async getWithdrawals() {
    try {
      this.withdrawals = await this.accountService.getWithdrawals();
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  initTransactions() {

    for (let withdrawal of this.withdrawals) {
      this.transactions.push(new Transaction(withdrawal.id, withdrawal.transactionDate, withdrawal.userId, '', withdrawal.amount, 'Withdrawal'));
    }

    for (let deposit of this.deposits) {
      this.transactions.push(new Transaction(deposit.id, deposit.transactionDate, deposit.userId, '', deposit.amount, 'Deposit'));
    }

    this.transactions.sort((a, b) => {
      return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
    });

  }

  calculateBalanceProgress() {
    let balance = this.initialBalance; // Start with the initial balance
    console.log("Initial Balance: ", balance);

    this.balanceProgress = this.transactions.map((transaction) => {
      // Adjust the balance based on the transaction type
      if (transaction.type === 'Deposit') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }

      // push the initial balance to the balance progress array from the left at the first index


      // Return an object representing the balance progress after the transaction
      return { balance, type: transaction.type };
    });

  }


  calculateBalanceProgressPercentage() {

    let initial = this.initialBalance;
    console.log("Initial Balance: ", initial);
    let current = this.account.balance;
    console.log("Current Balance: ", current);
    let diff = current - initial;
    console.log("Difference: ", diff);
    if (initial == 0) {
     
      initial = this.balanceProgress[1].balance;

      this.percentage = (diff / initial) * 100;
      console.log("Percentage: ", this.percentage);



    } else {
      this.percentage = (diff / initial) * 100;
      console.log("Percentage: ", this.percentage);
    }

    // keep only 2 decimal places
    this.percentage = Math.round(this.percentage * 100) / 100;
  }


  percentage : number = 0;



  getInitialBalance() {
    this.initTransactions();
    console.log("Transactions: ", this.transactions);
    console.log("Deposits: ", this.deposits);
    console.log("Withdrawals: ", this.withdrawals);
    console.log("Initial Balance: ", this.initialBalance);
    

    // Calculate the initial balance by summing all deposits and subtracting all withdrawals from the account balance
    this.initialBalance = this.account.balance;
    for (const deposit of this.deposits) {
      this.initialBalance -= deposit.amount;
    }
    for (const withdrawal of this.withdrawals) {
      this.initialBalance += withdrawal.amount;
    }
  
    console.log("Initial Balance: ", this.initialBalance);
  

    return this.initialBalance;


  }
  
card : Card = new Card();
  async getAccountByHolderId() {
    try {
      const data = await this.accountService.getAccountByHolderId();
      this.account = data.Account;
      this.client = data.client;
      this.card =  data.card; 
      this.myBeneficiaries(this.account);

      // if this.account.expirationMonth < 10 then add a 0 before the month
      this.stringMonth = this.card.expirationMonth < 10 ? '0' + this.card.expirationMonth.toString() : this.card.expirationMonth.toString();

    } catch (error) {
      console.error('Error fetching account by holder ID:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }
  

  async myBeneficiaries(account: Account) {
    for (const beneficiary of account.beneficiariesIds) {
      try {
        const user = await this.userService.getUserById(beneficiary);
        this.beneficiaries.push(user);
      } catch (error) {
        console.error('Error fetching beneficiary:', error);
      }
    }
  }

  toggleBalanceVisibility() {
    this.balanceVisible = !this.balanceVisible;
  }

  ngAfterViewInit() {
    // this.renderChart();
  }

  getUser() {
    return this.client;
  }

  renderChart() {
    // call the get initial balance function to get the initial balance and push it to the balance progress array from the left at the first index
    this.balanceProgress.unshift({ balance: this.initialBalance, type: 'Initial Balance' });
    console.log("Balance Progress: ", this.balanceProgress);
    this.calculateBalanceProgressPercentage();

    const options = {
      chart: {
        height: '100%',
        maxWidth: '100%',
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2'],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 20, // Adjust padding as needed
          right: 10, // Adjust padding as needed
          top: 10, // Adjust padding as needed
          bottom: 10, // Adjust padding as needed
        },
      },
      series: [
        {
          name: 'Balance Progress',
          data: this.balanceProgress.map(item => item.balance),
          color: '#1A56DB',
        },
      ],
      xaxis: {
        categories: this.transactions.map((transaction) => { return new Date(transaction.transactionDate).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) }),
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
        style: {
          margin: '1000px',
        },
      },
    };

    if (document.getElementById('area-chart') && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById('area-chart'), options);
      chart.render();
    }
  }
  


}
