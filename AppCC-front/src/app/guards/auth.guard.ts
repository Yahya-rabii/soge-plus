import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {}
  async canActivate(): Promise<boolean> {
    try {
      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        this.router.navigate(['/login']).then();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in AuthGuard:', error);
      this.router.navigate(['/login']).then();
      return false;
    }
  }
}
