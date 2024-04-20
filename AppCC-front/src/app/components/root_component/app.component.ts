import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthenticationService } from '../../services/authentication.service';
import { CercularnavComponent } from '../cercularnav/cercularnav.component';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSideComponent } from '../side/custom-side.component';
import { UsersService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, FooterComponent, NavBarComponent, MatToolbarModule, CommonModule, MatButtonModule, MatIconModule, MatSidenavModule, CustomSideComponent, CercularnavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'


})
export class AppComponent implements OnInit {
  title = 'appcc-front';
  isAdmin: Boolean = false;
  hasAccount: Boolean = false;
  user: User = new User();
  constructor(private authService: AuthenticationService, private usersService: UsersService, private router: Router) { }
  collapsed = signal(false)
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px')

  ngOnInit(): void {
    initFlowbite();

    if (this.isLoggedIn()) {
      this.authService.isAdmin().then((isAdmin) => {
        this.isAdmin = isAdmin;
        if (!this.isAdmin) {
          this.getCurrentUser();

          


        }
      });


    }


  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    const userId: string = localStorage.getItem('UserId') ?? '';

    return this.usersService.getUserById(userId).then((user) => {
      this.user = user;
      this.hasAccount = user.hasAccount;
    });
  }

  createAccount() {
    this.router.navigate(['create-account']);
  }


}