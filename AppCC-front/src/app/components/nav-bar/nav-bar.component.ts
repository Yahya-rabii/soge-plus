import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {


  logout() {
    localStorage.removeItem('token');



    // refresh the page : 
    window.location.href = "/";
  }


  // check if the user is logged in or not
  isLoggedIn() {
    //return this.authenticationService.isAuthenticated();
  }
}
