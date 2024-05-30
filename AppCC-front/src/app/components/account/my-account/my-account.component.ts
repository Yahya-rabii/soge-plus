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
  constructor(
    private accountService: AccountService,
    private userService: UsersService,
  ) {}
  account: Account = new Account();
  client: User = new User();
  beneficiaries: User[] = [];
  deposits: AddTransaction[] = [];
  withdrawals: SubTransaction[] = [];
  currentDate: Date = new Date();
  transactions: Transaction[] = [];
  balanceVisible: boolean = false;
  balanceProgress: { balance: number; type: string }[] = [];
  initialBalance: number = 0;
  income: number = 0;
  stringMonth: string = '';
  balance: number = 0;
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
  getBalance() {
    if (this.account.balance >= 0) {
      return this.account.balance;
    }
    return 0;
  }
  back: boolean = false;
  front: boolean = true;
  flipCard() {
    this.back = !this.back;
    this.front = !this.front;
  }
  async getDeposits() {
    try {
      this.deposits = await this.accountService.getDeposits();
      this.income = this.deposits.reduce(
        (acc, deposit) => acc + deposit.amount,
        0,
      );
    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error;
    }
  }
  async getWithdrawals() {
    try {
      this.withdrawals = await this.accountService.getWithdrawals();
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  }
  initTransactions() {
    for (let withdrawal of this.withdrawals) {
      this.transactions.push(
        new Transaction(
          withdrawal.id,
          withdrawal.transactionDate,
          withdrawal.userId,
          '',
          withdrawal.amount,
          'Withdrawal',
        ),
      );
    }
    for (let deposit of this.deposits) {
      this.transactions.push(
        new Transaction(
          deposit.id,
          deposit.transactionDate,
          deposit.userId,
          '',
          deposit.amount,
          'Deposit',
        ),
      );
    }
    this.transactions.sort((a, b) => {
      return (
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
      );
    });
  }
  calculateBalanceProgress() {
    this.balance = this.initialBalance;
    console.log('Initial Balance: ', this.balance);
    this.balanceProgress = this.transactions.map((transaction) => {
      if (transaction.type === 'Deposit') {
        this.balance += transaction.amount;
      } else {
        this.balance -= transaction.amount;
      }
      return { balance: this.balance, type: transaction.type };
    });
  }
  calculateBalanceProgressPercentage() {
    let initial = this.initialBalance;
    console.log('Initial Balance: ', initial);
    if (!this.account || typeof this.account.balance === 'undefined') {
      console.error('Account or account balance is undefined');
      this.percentage = 0;
      return;
    }
    let current = this.account.balance;
    console.log('Current Balance: ', current);
    let diff = current - initial;
    console.log('Difference: ', diff);
    if (
      initial === 0 &&
      this.balanceProgress &&
      this.balanceProgress.length > 1
    ) {
      initial = this.balanceProgress[1].balance;
    }
    if (initial !== 0) {
      this.percentage = (diff / initial) * 100;
    } else {
      this.percentage = 0;
    }
    console.log('Percentage: ', this.percentage);
    this.percentage = Math.round(this.percentage * 100) / 100;
    if (isNaN(this.percentage)) {
      this.percentage = 0;
    }
  }
  isNaN(value: number): boolean {
    return isNaN(value);
  }
  percentage: number = 0;
  getInitialBalance() {
    this.initTransactions();
    console.log('Transactions: ', this.transactions);
    console.log('Deposits: ', this.deposits);
    console.log('Withdrawals: ', this.withdrawals);
    console.log('Initial Balance: ', this.initialBalance);
    this.initialBalance = this.account.balance;
    for (const deposit of this.deposits) {
      this.initialBalance -= deposit.amount;
    }
    for (const withdrawal of this.withdrawals) {
      this.initialBalance += withdrawal.amount;
    }
    console.log('Initial Balance: ', this.initialBalance);
    return this.initialBalance;
  }
  card: Card = new Card();


  


  async getAccountByHolderId() {
    try {
      const data = await this.accountService.getAccountByHolderId();
      this.account = data.Account;
      this.client = this.userService.getUser();
      this.card = data.card;
      this.myBeneficiaries(this.account);
      this.stringMonth =
        this.card.expirationMonth < 10
          ? '0' + this.card.expirationMonth.toString()
          : this.card.expirationMonth.toString();
    } catch (error) {
      console.error('Error fetching account by holder ID:', error);
      throw error;
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
  ngAfterViewInit() {}
  getUser() {
    return this.client;
  }
  renderChart() {
    this.balanceProgress.unshift({
      balance: this.initialBalance,
      type: 'Initial Balance',
    });
    console.log('Balance Progress: ', this.balanceProgress);
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
          left: 20,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      series: [
        {
          name: 'Balance Progress',
          data: this.balanceProgress.map((item) => item.balance),
          color: '#1A56DB',
        },
      ],
      xaxis: {
        categories: this.transactions.map((transaction) => {
          return new Date(transaction.transactionDate).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        }),
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
    if (
      document.getElementById('area-chart') &&
      typeof ApexCharts !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('area-chart'),
        options,
      );
      chart.render();
    }
  }
}
