import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';

import { SideBarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, UserDropdownComponent , SideBarComponent],
  standalone: true
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
