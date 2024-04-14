import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthenticationService } from '../services/authentication.service';



import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSideComponent } from '../components/side/custom-side.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,LoginComponent , FooterComponent , NavBarComponent, MatToolbarModule,CommonModule , MatButtonModule, MatIconModule , MatSidenavModule , CustomSideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'


})
export class AppComponent implements OnInit {
  title = 'appcc-front';
  isAdmin :Boolean = false;

  constructor(private authService : AuthenticationService){}
  collapsed =signal(false)
  sidenavWidth = computed(()=> this.collapsed() ? '65px' :'250px')
  
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