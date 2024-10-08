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
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
