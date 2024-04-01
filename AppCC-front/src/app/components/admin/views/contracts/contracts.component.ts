import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../../services/contract.service';
import { Contract } from '../../../../models/contract.model';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.css'
})
export class ContractsComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
    this.getContractsOfClient();
  }

  contracts : Contract[] = [];
 
  // get contracts of the user 
  getContractsOfClient(){
    from(this.contractService.getContractsOfClient()).subscribe((data) => {
      this.contracts = data.contracts;
    });
  }

}
