import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit{

  constructor(private accountService: AccountService) { }
  account : Account = new Account();
  // Method to get account by account holder ID
  ngOnInit() {
    this.getAccountByHolderId();
  }
  public getAccountByHolderId() {
    this.accountService.getAccountByHolderId().then((data) => {
      this.account = data;
    });
  }
}
