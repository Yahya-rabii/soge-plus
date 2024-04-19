import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cercularnav',
  templateUrl: './cercularnav.component.html',
  styleUrls: ['./cercularnav.component.css'],
  standalone: true,
  imports : [CommonModule,MatIconModule]
})
export class CercularnavComponent {
  constructor(private router: Router) {}
  toggleNav() {
    const nav = document.getElementById('nav');
    nav?.classList.toggle('closed');

    // if the nav is open, slide the element with the id of login-signup to the right by 20px with a transition of 0.5s and slide it back to the left by 20px with a transition of 0.5s if the nav is closed
    const loginSignup = document.getElementById('login-signup');
    const createAccountBtn = document.getElementById('create-account-button');
    if (loginSignup) {
      loginSignup.style.transition = '0.5s';
      loginSignup.style.transform = nav?.classList.contains('closed') ? 'translateX(0)' : 'translateX(-8.1rem)';
    }
    if (createAccountBtn) {
      createAccountBtn.style.transition = '0.5s';
      createAccountBtn.style.transform = nav?.classList.contains('closed') ? 'translateX(0)' : 'translateX(-8.1rem)';
    }
  }

  toggleAbout() {
    this.router.navigate(['/about']);
    this.toggleNav();
  }

  toggleContact() {
    this.router.navigate(['/contact']);
    this.toggleNav();
  }

  togglePolicy() {
    this.router.navigate(['/privacypolicy']);
    this.toggleNav();

  }

}
