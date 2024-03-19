import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,LoginComponent , FooterComponent , NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'


})
export class AppComponent {
  title = 'appcc-front';
  ngOnInit(): void {
    initFlowbite();
  }

}