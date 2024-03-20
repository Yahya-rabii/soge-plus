import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor() {
  }

  logout() {
    // Call the logout method from the authentication service
    // this.authService.logout().subscribe(() => {
    //   // Redirect the user to the login page
    //   this.router.navigate(['/login']);
    // });
  }


  // check if the user is logged in or not
  isLoggedIn() {
    // return this.authService.isLoggedIn();
  }
}
