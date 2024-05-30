import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { UserstableComponent } from './userstable/userstable.component';
import { ContractsVComponent } from './contracts-v/contracts-v.component';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    CardsComponent,
    UserstableComponent,
    ContractsVComponent,
  ],
  standalone: true,
})
export class DashboardComponent {}
