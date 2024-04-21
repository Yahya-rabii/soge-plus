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
  MenuWithSubItems = signal<MenuWithSubItems[]>([]);
  subItems = signal<subItems[]>([]);
  user: User = new User();
  hasAccount: boolean = false;
  image: string = '';

  constructor(private authService: AuthenticationService, private router: Router, private usersService: UsersService) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }


  ngOnInit() {
    if (this.isLoggedIn()) {
      this.authService.isAdmin().then((isAdmin) => {
        this.isAdmin = isAdmin;

        if (this.isAdmin) {
          // get the image from assets folder
          this.image = 'assets/img/profiles/admin.png';
          this.menuItems = signal<MenuItem[]>([
            { label: 'Dashboard', icon: 'dashboard', route: 'admin' },
            { label: 'Loans Requests', icon: 'account_balance', route: 'loansRequests' },
            { label: 'Users', icon: 'people', route: 'users' },
            { label: 'Contracts', icon: 'description', route: 'contracts' },
          ]);

        } else {
          this.image = 'assets/img/profiles/user.png';
          this.menuItems = signal<MenuItem[]>([
            { label: 'Home', icon: 'home', route: 'home' },
            { label: 'My Loans', icon: 'money', route: 'myloans' },
            { label: 'Create Loan', icon: 'add', route: 'loan/createloan' },
            { label: 'My Contracts', icon: 'description', route: 'mycontracts' },
          ]);

          const userId :string = localStorage.getItem('UserId') ?? '';
          this.usersService.getUserById(userId).then((user) => {
            if (user.hasAccount == true) {


              const element = document.getElementById('create-account-button');
              if (element) {
                element.style.display = 'none';
              }

              this.subItems.update((items) => {
                items.push(
                  { label: 'Add Transaction', icon: 'account_balance_wallet', route: 'add-transaction' },
                  { label: 'Add Beneficiary', icon: 'person_add', route: 'add-beneficiary' }
                );
                return items;
              });

              this.MenuWithSubItems.update((items) => {
                items.push({ label: 'My Account', icon: 'account_circle', route: 'myaccount', subItems: this.subItems() });
                return items;
              });


            }
            else {
              const element = document.getElementById('create-account-button');
              if (element) {
                element.style.display = 'block';
              }
            }
           
  
           
          });
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
      //do nothing
      
    });
  }


  // Method to check if the current route is /myaccount
  isMyAccountRoute() {
    return this.router.url === '/myaccount';
  }


  isDropdownOpen: boolean = false;

  // Method to toggle the dropdown state
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

export type MenuItem = {
  label: string;
  icon: string;
  route: string;
};

export type subItems = {
  label: string;
  icon: string;
  route: string;
};

export type MenuWithSubItems = {
  label: string;
  icon: string;
  route: string;
  subItems: subItems[];
};

export type LogoutItem = {
  label: string;
  icon: string;
};

