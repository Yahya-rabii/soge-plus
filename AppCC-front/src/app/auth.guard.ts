import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router ) { }

  async canActivate(): Promise<boolean> {
    if (this.authService.isLoggedIn()) {
        this.authService.getRoles().pipe( map((rolesObject: { roles: string[] }) => { // Assuming roles is an array of strings
          const rolesArray = rolesObject.roles;
      if (rolesArray.includes('ADMIN')) {
        // window.location.href = '/admin'; this might cause a loop in the browser because the guard will be called again and again  so we use the router to navigate to the admin page
        this.router.navigate(['/admin']);
        // to insure that the loading of the page is done before the guard returns true we use subscribe
        return true;
      } else if (!rolesArray.includes('ADMIN')){
       
        if (window.location.href.includes('admin')) {
          window.location.href = '/inte';
        }
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
