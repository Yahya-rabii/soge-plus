import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../services/contract.service';
import { Contract } from '../../../models/contract.model';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';
import { UsersService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.css'
})
export class ContractsComponent implements OnInit {

  constructor(private contractService: ContractService , private userService :UsersService) { }

  ngOnInit(): void {
    this.getContracts();
  }

  contracts : Contract[] = [];
  users : User[] = [];
 
 


  getContracts(){
    {
      //loop over all users and get their contracts 
      from(this.userService.getUsers()).subscribe((data) => {
        this.users = data;
        this.users.forEach(user => {
          this.contractService.getContractsOfClients(user.id).then((data) => {
            this.contracts = data.contracts;
          });
        });
      });

    }



  }

}
