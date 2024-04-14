import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cercularnav',
  templateUrl: './cercularnav.component.html',
  styleUrls: ['./cercularnav.component.scss'],
  standalone: true,
  imports : [CommonModule,MatIconModule]
})
export class CercularnavComponent {
  constructor(private router: Router) {}
  toggleNav() {
    const nav = document.getElementById('nav');
    nav?.classList.toggle('closed');
  }

  toggleAbout() {
    this.router.navigate(['/about']);
    const nav = document.getElementById('nav');
    nav?.classList.toggle('closed');

  }

  toggleContact() {
    this.router.navigate(['/contact']);
    const nav = document.getElementById('nav');
    nav?.classList.toggle('closed');

  }

  togglePolicy() {
    this.router.navigate(['/privacypolicy']);
    const nav = document.getElementById('nav');
    nav?.classList.toggle('closed');

  }

}
