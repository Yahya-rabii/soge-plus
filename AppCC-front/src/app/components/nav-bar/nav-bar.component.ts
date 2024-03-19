import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor(private oauthService: OAuthService) {
  }

  logout() {
    this.oauthService.logOut();
  }


  // check if the user is logged in or not
  isLoggedIn() {
    console.log(this.oauthService.hasValidAccessToken());
    return this.oauthService.hasValidAccessToken();
  }
}
