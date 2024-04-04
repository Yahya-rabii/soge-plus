import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    try {
      const rolesObject = await this.authService.getRoles();
      const isAdmin = rolesObject.roles.includes('ADMIN');
      if (isAdmin) {
        this.router.navigate(['/admin']);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in UserGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
