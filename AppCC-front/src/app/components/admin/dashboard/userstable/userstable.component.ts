import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../../services/contract.service';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-userstable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userstable.component.html',
  styleUrl: './userstable.component.css'
})
export class UserstableComponent implements OnInit {
  constructor(private contractService: ContractService) { }

  clients : User[] = [];

  ngOnInit(): void {
    this.getContracts();
  }
 

  // get contracts from the server
 // get contracts of the user 
 getContracts(){
  from(this.contractService.getContracts()).subscribe((data) => {
    this.clients = data.clients;
  });
}
}
