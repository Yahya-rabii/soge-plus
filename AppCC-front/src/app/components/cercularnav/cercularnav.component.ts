import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cercularnav',
  templateUrl: './cercularnav.component.html',
  styleUrls: ['./cercularnav.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class CercularnavComponent {
  constructor(private router: Router) {}
  toggleNav() {
    const nav = document.getElementById('nav');
    nav?.classList.toggle('closed');
    const loginSignup = document.getElementById('login-signup');
    const createAccountBtn = document.getElementById('create-account-button');
    if (loginSignup) {
      loginSignup.style.transition = '0.5s';
      loginSignup.style.transform = nav?.classList.contains('closed')
        ? 'translateX(0)'
        : 'translateX(-8.1rem)';
    }
    if (createAccountBtn) {
      createAccountBtn.style.transition = '0.5s';
      createAccountBtn.style.transform = nav?.classList.contains('closed')
        ? 'translateX(0)'
        : 'translateX(-8.1rem)';
    }
  }
  toggleAbout() {
    this.router.navigate(['/about']).then();
    this.toggleNav();
  }
  toggleContact() {
    this.router.navigate(['/contact']).then();
    this.toggleNav();
  }
  togglePolicy() {
    this.router.navigate(['/privacypolicy']).then();
    this.toggleNav();
  }
}
