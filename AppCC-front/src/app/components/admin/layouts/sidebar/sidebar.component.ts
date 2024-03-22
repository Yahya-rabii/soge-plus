import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import mat-sidenav-container
import { Router } from '@angular/router';



@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SideBarComponent {
  constructor( private router: Router ) { }
 

  isAdmin: boolean = false;
  

  ngOnInit() {
    
  }
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
 

}