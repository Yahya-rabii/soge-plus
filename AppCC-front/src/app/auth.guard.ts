import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isLoggedIn()) {
        this.authService.getRoles().pipe( map((rolesObject: { roles: string[] }) => { // Assuming roles is an array of strings
          const rolesArray = rolesObject.roles;
      if (rolesArray.includes('ADMIN')) {
        this.router.navigate(['/admin']);
      } else if (!rolesArray.includes('ADMIN')){
        return true;

      }
      return true;
    } )).subscribe();
  }
    else {
      // If the user is not logged in, navigate to the login page
      this.router.navigate(['/login']);
      return false;
    }

    return true;    
  }
}
