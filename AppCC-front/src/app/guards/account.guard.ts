import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UsersService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {
  constructor(private authService: AuthenticationService,private userService : UsersService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    try {
      const isLoggedIn = await this.authService.isLoggedIn();
      if (isLoggedIn) {
        const userid : string = localStorage.getItem('UserId') || '';
        this.userService.getUserById(userid).then((user) => {
          if (user.hasAccount) {
            return true;
          }
          else {
            this.router.navigate(['/home']);
            return false;
          }
        }
        ).catch(error => {
          console.error('Error fetching user:', error);
          this.router.navigate(['/home']);
          return false;
        });
      }
      return true;
    } catch (error) {
      console.error('Error in AuthGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
