import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor(private authService: AuthenticationService , private router: Router) {
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      (error) => {
        alert('An error occurred while logging out');
      }
    );
  }


  // check if the user is logged in or not
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  IsAdminRoute() {
    return window.location.pathname.includes('admin');
  }  
}
