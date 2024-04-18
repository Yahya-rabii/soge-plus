import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { UsersService } from '../../services/user.service';
import { Contract } from '../../models/contract.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {


  constructor(private contractService  :ContractService , private usersService : UsersService) { }

  Contracts : Contract[] = [];

  ngOnInit(): void {


    // get the current user and then get the contracts of that user 
    const userId :string = localStorage.getItem('UserId') ?? '';
    this.usersService.getUserById(userId).then((user) => {
      this.contractService.getContractsOfClients(user.id).then((data) => {
        this.Contracts = data.contracts;
      });
    });


  }

}
