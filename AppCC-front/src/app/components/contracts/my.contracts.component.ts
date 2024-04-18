import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { Contract } from '../../models/contract.model';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my.contracts.component.html',
  styleUrl: './my.contracts.component.css'
})
export class MyContractsComponent implements OnInit {

  rest : boolean = false;

  constructor(private contractService: ContractService , private userService :UsersService) { }

  showrest(){
    this.rest = !this.rest
  }


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
