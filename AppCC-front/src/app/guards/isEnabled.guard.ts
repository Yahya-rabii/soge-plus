import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UsersService } from '../services/user.service';
@Injectable({
  providedIn: 'root',
})
export class isEnabledGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private router: Router,
    private authService: AuthenticationService,
  ) {}
  async canActivate(): Promise<boolean> {
    try {
      const isLoggedIn = this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.router.navigate(['/login']).then();
        return false;
      }
      const isEnabled = await this.userService.getUserEmailVerified();
      if (!isEnabled) {
        this.router.navigate(['/enable']).then();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in isEnabledGuard:', error);
      this.router.navigate(['/']).then();
      return false;
    }
  }
}
