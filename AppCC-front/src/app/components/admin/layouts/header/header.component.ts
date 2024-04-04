import { Component } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { UsersService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule ,SideBarComponent],
  standalone: true
})
export class HeaderComponent {
  user: User = new User();
  showSidebar: boolean = false;
  constructor(private authService: AuthenticationService, private userService: UsersService) { }

  ngOnInit() {
    this.getUser();
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
      dropdownAvatar.classList.toggle('hidden');
    }
  }
}
