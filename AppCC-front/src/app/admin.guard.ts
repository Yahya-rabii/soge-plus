import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.getRoles().pipe(map((rolesObject: { roles: string[] }) => {
      return rolesObject.roles.includes('ADMIN');
    })).toPromise().then((isAdmin) => {
      if (!isAdmin) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    });
  }
}
