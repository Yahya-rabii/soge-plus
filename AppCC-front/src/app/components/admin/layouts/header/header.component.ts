import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { AuthenticationService } from '../../../../services/authentication.service';
import { UsersService } from '../../../../services/user.service';
import { from } from 'rxjs';
import { SideBarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [SideBarComponent,CommonModule],
  standalone: true
})
export class HeaderComponent implements OnInit{
  constructor(private renderer: Renderer2, private authService: AuthenticationService, private userService: UsersService) { }


  user: User = new User();



  

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
    const drawerNavigation = document.getElementById('drawer-navigation');
    if (drawerNavigation) {
      drawerNavigation.setAttribute('data-drawer-show', 'none');
    }
  }

  getUser() {
    from(this.userService.getUserById().then((user) => {
      this.user = user;
    }
    ));
    console.log(this.user);

  }

  toggleSidebar() {
    const drawerNavigation = document.getElementById('drawer-navigation');
    if (drawerNavigation) {
      const isDrawerOpen = drawerNavigation.getAttribute('data-drawer-show') === 'drawer-navigation';
      const newDrawerState = isDrawerOpen ? 'none' : 'drawer-navigation';
      drawerNavigation.setAttribute('data-drawer-show', newDrawerState);
    }
  }

  toggleUserDropdown() {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    if (dropdownAvatar) {
      dropdownAvatar.classList.toggle('hidden');
    }
  }
  
}
