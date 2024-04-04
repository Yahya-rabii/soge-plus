import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import mat-sidenav-container
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';



@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SideBarComponent {
  constructor(private authService: AuthenticationService, private router: Router) {}
  
  logout() {

    
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }


  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
 

}