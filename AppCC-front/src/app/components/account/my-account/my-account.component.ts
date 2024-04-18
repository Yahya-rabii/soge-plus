import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';

// import and use the pipe rib defined in src/app/pipes/rib.pipe.ts
import { RibPipe } from '../../../pipes/rib.pipe';
import { BalancePipe } from '../../../pipes/balance.pipe';



@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.css',
    // add the pipe to the component
    imports: [CommonModule, RibPipe, BalancePipe]
})
export class MyAccountComponent implements OnInit {

  constructor(private accountService: AccountService) { }
  accounts: Account[] = [];
  client: User = new User();
  
  // Method to get account by account holder ID
  ngOnInit() {
    this.getAccountByHolderId();
  }
  public getAccountByHolderId() {
    this.accountService.getAccountByHolderId().then((data) => {
      console.log(data);
      this.accounts = data.Accounts;
      this.client = data.client;
    });
  }



}
