import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';
import { CarouselComponent } from './components/carousel/carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CarouselComponent,CommonModule, RouterOutlet,LoginComponent , FooterComponent , NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'


})
export class AppComponent implements OnInit {
  title = 'appcc-front';

  ngOnInit(): void {
    initFlowbite();

  }
  home(): boolean {
    // Get the current URL
    const currentUrl = window.location.href;
  
    // Check if the current URL ends with '/'
    if (currentUrl.endsWith('/')) {
      
      return true;
    } else {
      return false;
    }
  }
  
  

}