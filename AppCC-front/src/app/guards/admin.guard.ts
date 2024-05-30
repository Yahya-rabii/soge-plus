import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {}
  async canActivate(): Promise<boolean> {
    try {
      const rolesObject: string[] = await this.authService.getRoles();
      const isAdmin = rolesObject.includes('ADMIN');
      if (isAdmin) {
        return true;
      }
      this.router.navigate(['/']).then();
      return false;
    } catch (error) {
      console.error('Error in AdminGuard:', error);
      this.router.navigate(['/login']).then();
      return false;
    }
  }
}
