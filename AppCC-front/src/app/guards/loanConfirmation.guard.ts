import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { CurrentRouteService } from '../services/previousRoute.service';

@Injectable({
  providedIn: 'root'
})
export class LoanConfirmationGuard implements CanActivate {

  constructor(private router: Router, private currentRouteService: CurrentRouteService) { }

  canActivate(): boolean {
    // Check if the previous route is 'loan/createloan'
    if (this.currentRouteService.getCurrentUrl() === '/loan/createloan') {
      return true;
    }
    // If not redirected from 'loan/createloan', redirect to the previous route
    else{
      window.history.back();
      return false;

    }


  }
}
