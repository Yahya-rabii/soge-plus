import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { UsersService } from '../../../../services/user.service';
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
  showSidebar: boolean = false;
  constructor(private authService: AuthenticationService, private userService: UsersService , private router : Router, private renderer: Renderer2) { }
  isAdmin: boolean = false;
  ngOnInit() {
    this.authService.isAdmin().then((isAdmin) =>
    {
      this.isAdmin = isAdmin;
    });
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
  
  
  @ViewChild('dropdownAvatar') dropdownAvatar!: ElementRef;

  isDropdownOpen: boolean = false;


  toggleUserDropdown() {
    if (this.isDropdownOpen) {
      // Close the dropdown
      this.dropdownAvatar.nativeElement.classList.add('hidden');
    } else {
      // Open the dropdown
      this.dropdownAvatar.nativeElement.classList.remove('hidden');
    }
    // Toggle the dropdown state
    this.isDropdownOpen = !this.isDropdownOpen;
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
