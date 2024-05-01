import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../../services/contract.service';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { UsersService } from '../../../../services/user.service';

@Component({
  selector: 'app-userstable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userstable.component.html',
  styleUrl: './userstable.component.css'
})
export class UserstableComponent implements OnInit {
  constructor(private userService: UsersService) { }

  clients : User[] = [];

  ngOnInit(): void {
    this.GetClients();
  }
 

  // get contracts from the server
 // get contracts of the user 
 GetClients(){
  from(this.userService.getUsers()).subscribe((data) => {
    if (data) {
      this.clients = data;
    }
    else {
      this.clients = [];
    }
  });
}
}
