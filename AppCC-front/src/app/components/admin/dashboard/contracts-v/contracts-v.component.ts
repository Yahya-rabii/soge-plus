import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';
import { ContractService } from '../../../../services/contract.service';
import { Contract } from '../../../../models/contract.model';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-contracts-v',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts-v.component.html',
  styleUrl: './contracts-v.component.css'
})
export class ContractsVComponent implements OnInit {
  eventDate: any = formatDate(new Date(), 'MMM dd, yyyy', 'en');
  constructor(private contractService: ContractService) { }

  contracts : Contract[] = [];

  ngOnInit(): void {
    this.getContracts();
  }
 

 // get contracts of the user 
 getContracts(){
  this.contractService.getContracts().then((contracts) => {
    if (contracts) {
      this.contracts = contracts;
    }
    else{
      console.log("No contracts found");
    }

  });
}

}
