import { Component, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthenticationService } from '../../services/authentication.service';
import { CercularnavComponent } from '../cercularnav/cercularnav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSideComponent } from '../side/custom-side.component';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { TokenRefreshService } from '../../services/token-refresh.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { filter, map } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    FooterComponent,
    NavBarComponent,
    MatToolbarModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    CustomSideComponent,
    CercularnavComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'appcc-front';
  isAdmin: Boolean = false;
  hasAccount: Boolean = false;
  isEmailValid: Boolean = false;
  user: User = new User();
  constructor(
    private authService: AuthenticationService,
    private usersService: UsersService,
    private router: Router,
    private refreshToken: TokenRefreshService,
  ) {}
  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));
  loading = false;
  ngOnInit(): void {
    initFlowbite();
    this.isEmailValid = this.usersService.getUserEmailVerified();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        map(() => this.router.url),
      )
      .subscribe((url: string) => {
        const excludePaths: string[] = ['/privacypolicy', '/contact', '/about'];
        const shouldExcludeAnimation = excludePaths.some((route) =>
          url.startsWith(route),
        );
        if (!shouldExcludeAnimation) {
          this.loading = true;
        }
      });
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
  }
  getCurrentUser() {
    const userId: string = this.authService.getUserId();
    return this.usersService.getUserById(userId).then((user) => {
      this.user = user;
      this.hasAccount = user.hasAccount;
    });
  }
  createAccount() {
    this.router.navigate(['account/create-account']).then();
  }
  toValidate() {
    this.router.navigate(['/enable']).then();
  }
}
