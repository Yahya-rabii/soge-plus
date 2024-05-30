import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class CurrentRouteService {
  private currentUrl: string;
  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }
  public getCurrentUrl() {
    console.log('Current URL in PreviousRouteService:', this.currentUrl);
    return this.currentUrl;
  }
}
