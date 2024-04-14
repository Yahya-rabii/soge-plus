import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';

import { OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';
import { NavBarAdminComponent } from '../components/admin/layouts/nav-bar-admin/nav.bar.admin.component';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,NavBarAdminComponent, RouterOutlet,LoginComponent , FooterComponent , NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'


})
export class AppComponent implements OnInit {
  title = 'appcc-front';
  isAdmin :Boolean = false;

  constructor(private authService : AuthenticationService){}

  ngOnInit(): void {
    initFlowbite();

   if (this.isLoggedIn()) {
    this.authService.isAdmin().then((isAdmin) =>
      {
        this.isAdmin = isAdmin;
      });
    }
    


  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  

}