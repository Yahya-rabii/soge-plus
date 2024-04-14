import { Component, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private renderer: Renderer2,
    private userService: UsersService
  ) {}

  user: User = new User();

  ngOnInit() {

    // if the user is not an admin, call the getUser method
    if (this.isLoggedIn()) {
      this.authService.isAdmin().then((isAdmin) => {
        if (!isAdmin) {
          this.getUser();
        }
      });
    }
  
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


  async getUser() {
    try {
      this.user = await this.userService.getUserById();
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
    }).catch((error) => {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out');
    });
  }
  

  toggleUserDropdown() {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    if (dropdownAvatar) {
      const isDropdownOpen = dropdownAvatar.classList.contains('hidden');
      this.renderer.setStyle(dropdownAvatar, 'display', isDropdownOpen ? 'block' : 'none');
    }
  }

  showSidebar: boolean = false;

  
  toggleSidebar() {
   if(this.isLoggedIn()){
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
   }
  }


  
}
