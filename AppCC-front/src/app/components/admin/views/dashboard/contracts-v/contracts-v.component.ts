import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-contracts-v',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contracts-v.component.html',
  styleUrl: './contracts-v.component.css'
})
export class ContractsVComponent  {
  eventDate: any = formatDate(new Date(), 'MMM dd, yyyy', 'en');

 
}
