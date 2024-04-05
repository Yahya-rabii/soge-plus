import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(): boolean {
    try {
      const rolesObject = this.authService.getRoles().then((role) => {
        const isAdmin = role.roles.includes('ADMIN');
        if (isAdmin) {
          this.router.navigate(['/admin']);
          return Promise.resolve(false);
        } else {
          this.router.navigate(['/']);
          return Promise.resolve(true);
        }
      });
  
      return true;
    } catch (error) {
      this.router.navigate(['/login']);
      return false
    }
  }
}
