import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-custom-side',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './custom-side.component.html',
  styleUrl: './custom-side.component.css'
})
export class CustomSideComponent implements OnInit {

  isAdmin: boolean = false;
  menuItems = signal<MenuItem[]>([]);
  user: User = new User();
  hasAccount: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router , private usersService : UsersService) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.usersService.getUserById().then((user) => {
      this.user = user;
      this.hasAccount = user.hasAccount;
    });
  }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.authService.isAdmin().then((isAdmin) => {
        this.isAdmin = isAdmin;



        if (this.isAdmin) {
          console.log("admin")
          this.menuItems = signal<MenuItem[]>([
            { label: 'Dashboard', icon: 'dashboard', route: 'admin' },
            { label: 'Loans Requests', icon: 'account_balance', route: 'loansRequests' },
            { label: 'Users', icon: 'people', route: 'users' },
            { label: 'Contracts', icon: 'description', route: 'contracts' },
          ]);

        }

        else {
          this.menuItems = signal<MenuItem[]>([
            // home and my loans and create loan
            { label: 'Home', icon: 'home', route: 'home' },
            { label: 'My Loans', icon: 'money', route: 'myloans' },
            { label: 'Create Loan', icon: 'add', route: 'loan/createloan' },
            // my contracts 
            { label: 'My Contracts', icon: 'description', route: 'mycontracts' },
          ]);
          this.getCurrentUser();

          if (this.hasAccount) {
            this.menuItems.update((items) => {
              items.push({ label: 'My Account', icon: 'account_circle', route: 'myAccount' });
              return items;
            });
          }

        }



      });
    }
  }


  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val)
  }






  logoutItem = signal<LogoutItem[]>([
    { label: 'Logout', icon: 'logout' }
  ]);

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100')

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}


export type MenuItem = {
  label: string;
  icon: string;
  route: string;
};

export type LogoutItem = {
  label: string;
  icon: string;
};


