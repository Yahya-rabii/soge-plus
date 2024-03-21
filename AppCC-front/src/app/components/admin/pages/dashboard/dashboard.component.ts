import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [SideBarComponent , CommonModule, NavbarComponent ],
  standalone : true
})
export class DashboardComponent implements OnInit {
  date = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}
