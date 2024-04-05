import { Component, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { UsersService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { SideBarAdminComponent } from '../side-bar-admin/side.bar.admin.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './nav.bar.admin.component.html',
  styleUrls: ['./nav.bar.admin.component.css'],
  imports: [CommonModule ,SideBarAdminComponent],
  standalone: true
})
export class NavBarAdminComponent {
  user: User = new User();
  showSidebar: boolean = false;
  constructor(private authService: AuthenticationService, private userService: UsersService , private router : Router, private renderer: Renderer2) { }
  isAdmin: boolean = false;
  ngOnInit() {
    this.getUser();
    
    this.authService.isAdmin().then((isAdmin) =>
    {
      this.isAdmin = isAdmin;
    });
  }

  getUser() {
    this.userService.getUserById().then((user) => {
      this.user = user;
    }).catch(error => console.error('Error fetching user:', error));
  }

  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
    }).catch((error) => {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out');
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }
  
  
  toggleUserDropdown() {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    if (dropdownAvatar) {
      const isDropdownOpen = dropdownAvatar.classList.contains('hidden');
      this.renderer.setStyle(dropdownAvatar, 'display', isDropdownOpen ? 'block' : 'none');
    }
  }


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

}
