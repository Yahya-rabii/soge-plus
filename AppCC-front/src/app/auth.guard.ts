import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.getRoles().pipe(
      take(1), // Take only the first emission from the observable and complete
      map((rolesObject: { roles: string[] }) => {
        const isNotAdmin = !rolesObject.roles.includes('ADMIN');
        if (!isNotAdmin) {
          this.router.navigate(['/admin']); // Redirect admin users
          return false;
        }
        return true;
      }),
      catchError(() => {
        // Handle any errors that occur during the execution of the observable chain
        this.router.navigate(['/login']); // Redirect to login or an error page as appropriate
        return of(false); // Return false to indicate the guard should not allow navigation
      })
    ).toPromise().then(result => result !== undefined ? result : false); // Ensure undefined is coerced to false
  }
}
