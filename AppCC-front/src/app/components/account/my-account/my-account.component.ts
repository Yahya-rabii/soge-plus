import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';

// import and use the pipe rib defined in src/app/pipes/rib.pipe.ts
import { RibPipe } from '../../../pipes/rib.pipe';
import { BalancePipe } from '../../../pipes/balance.pipe';
import { UsersService } from '../../../services/user.service';
import { MatIconModule } from '@angular/material/icon';



@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.css',
    // add the pipe to the component
    imports: [CommonModule, RibPipe, BalancePipe,MatIconModule]
})
export class MyAccountComponent implements OnInit {

  constructor(private accountService: AccountService, private userService : UsersService) { }
  account: Account = new Account();
  client: User = new User();
  beneficiaries: User[] = [];
  
  // Method to get account by account holder ID
  ngOnInit() {
    this.getAccountByHolderId();

  }
  public getAccountByHolderId() {
    this.accountService.getAccountByHolderId().then((data) => {
      console.log(data);
      this.account = data.Account;
      this.client = data.client;
      this.myBeneficiaries(this.account);
      
    });
  }


  // Method to get the beneficiaries of the account
  myBeneficiaries( account: Account) {
    for (let beneficiary of account.beneficiariesIds) {
      this.userService.getUserById(beneficiary).then((user) => {
        console.log(user)
        this.beneficiaries.push(user);
      });
    }
  }




}
