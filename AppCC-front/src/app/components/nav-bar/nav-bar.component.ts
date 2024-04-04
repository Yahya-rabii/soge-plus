import { Component, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { from } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  constructor(private authService: AuthenticationService , private router: Router ,  private renderer: Renderer2 , private userService: UsersService) {}
  user: User = new User();
  isAdmin: boolean = false;
 

  

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        alert('An error occurred while logging out');
      }
    });
  }
  
  
  ngOnInit() {
    this.getUser();
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      // set the init css style from display none to be visible
      if (! isAdmin) {
        const navBar = document.getElementById('init');
        this.renderer.setStyle(navBar, 'display', 'block');
      }
      else {
        
        
      }
    });
    const drawerNavigation = document.getElementById('drawer-navigation');
    if (drawerNavigation) {
      drawerNavigation.setAttribute('data-drawer-show', 'none');
    }   
      
 
  }



  // check if the user is logged in or not
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  login() {
    this.router.navigate(['/login']);
  }
  signup() {
    this.router.navigate(['/signup']);
  }

  applyLoan() {
    this.router.navigate(['/loan/createloan']);
  }

  getUser() {
    from(this.userService.getUserById().then((user) => {
      this.user = user;
    }
    ));
    console.log(this.user);

  }

  toggleUserDropdown() {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    if (dropdownAvatar) {
      const isDropdownOpen = dropdownAvatar.classList.contains('hidden');
      this.renderer.setStyle(dropdownAvatar, 'display', isDropdownOpen ? 'block' : 'none');
    }
  }


  toggleSidebar() {
    const drawerNavigation = document.getElementById('drawer-navigation');
    if (drawerNavigation) {
      const isDrawerOpen = drawerNavigation.getAttribute('data-drawer-show') === 'drawer-navigation';
      const newDrawerState = isDrawerOpen ? 'none' : 'drawer-navigation';
      drawerNavigation.setAttribute('data-drawer-show', newDrawerState);
    }
  }




}
