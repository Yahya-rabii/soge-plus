import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {}
  canActivate(): boolean {
    try {
      this.authService.getRoles().then((roles) => {
        const isAdmin = roles.includes('ADMIN');
        if (isAdmin) {
          this.router.navigate(['/admin/dashboard']).then();
          return Promise.resolve(false);
        } else {
          return Promise.resolve(true);
        }
      });
      return true;
    } catch (error) {
      this.router.navigate(['/']).then();
      return false;
    }
  }
}
