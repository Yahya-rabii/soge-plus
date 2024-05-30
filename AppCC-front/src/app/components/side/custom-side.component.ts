import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
@Component({
  selector: 'app-custom-side',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './custom-side.component.html',
  styleUrl: './custom-side.component.css',
})
export class CustomSideComponent implements OnInit {
  isAdmin: boolean = false;
  menuItems = signal<MenuItem[]>([]);
  MenuWithSubItems = signal<MenuWithSubItems[]>([]);
  subItems = signal<subItems[]>([]);
  user: User = new User();
  hasAccount: boolean = false;
  image: string = '';
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private usersService: UsersService,
    private accountService: AccountService,
  ) {}
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  getUser() {
    const userId: string = this.authService.getUserId();
    this.authService.isAdmin().then(async (isAdmin) => {
      this.isAdmin = isAdmin;
      if (!this.isAdmin) {
        this.usersService.getUserById(userId).then((user) => {
          this.user = user;
        });
      }
    });
  }
  getUserName() {
    if (this.isAdmin) {
      return 'Admin';
    }
    return this.user.firstName + ' ' + this.user.lastName;
  }
  getUserdisplyer() {
    if (this.isAdmin) {
      return 'Admin';
    }
    return this.user.email;
  }
  ngOnInit() {
    this.getUser();
    if (this.isLoggedIn()) {
      this.authService.isAdmin().then(async (isAdmin) => {
        this.isAdmin = isAdmin;
        if (this.isAdmin) {
          this.image = 'assets/img/profiles/admin.png';
          this.menuItems = signal<MenuItem[]>([
            { label: 'Dashboard', icon: 'dashboard', route: 'admin/dashboard' },
            {
              label: 'Loans Requests',
              icon: 'account_balance',
              route: 'admin/loans-requests',
            },
            { label: 'Users', icon: 'people', route: 'admin/users' },
            {
              label: 'Contracts',
              icon: 'description',
              route: 'admin/contracts',
            },
          ]);
          const element = document.getElementById('create-account-button');
          if (element) {
            element.style.display = 'none';
          }
        } else {
          this.getUser();
          this.image = 'assets/img/profiles/user.png';
          this.menuItems = signal<MenuItem[]>([
            { label: 'Home', icon: 'home', route: 'home' },
            { label: 'My Loans', icon: 'money', route: 'loan/myloans' },
            { label: 'Create Loan', icon: 'add', route: 'loan/createloan' },
            {
              label: 'My Contracts',
              icon: 'description',
              route: 'mycontracts',
            },
          ]);
          const userId: string = this.authService.getUserId();
          this.usersService.getUserById(userId).then((user) => {
            if (user.hasAccount == true) {
              const element = document.getElementById('create-account-button');
              if (element) {
                element.style.display = 'none';
              }
              this.menuItems.update((items) => {
                items.push(
                  {
                    label: 'My Account',
                    icon: 'account_circle',
                    route: 'account/myaccount',
                  },
                  {
                    label: 'Add Transaction',
                    icon: 'account_balance_wallet',
                    route: 'account/add-transaction',
                  },
                  {
                    label: 'Add Beneficiary',
                    icon: 'person_add',
                    route: 'account/add-beneficiary',
                  },
                  {
                    label: 'My Transactions',
                    icon: 'alt_route',
                    route: 'account/my-transactions',
                  },
                );
                return items;
              });
            }
          });
        }
      });
    }
  }
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  logoutItem = signal<LogoutItem[]>([{ label: 'Logout', icon: 'logout' }]);
  profilePicSize = computed(() => (this.sideNavCollapsed() ? '32' : '100'));
  logout() {
    this.authService.logout();
  }
  isMyAccountRoute() {
    return this.router.url === '/account/myaccount';
  }
  isDropdownOpen: boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeDropdown() {
    this.isDropdownOpen = false;
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
