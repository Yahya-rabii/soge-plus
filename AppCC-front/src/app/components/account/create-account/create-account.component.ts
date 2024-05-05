import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
import { RibPipe } from '../../../pipes/rib.pipe';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  standalone: true,
  imports: [CommonModule, RibPipe]
})
export class CreateAccountComponent implements OnInit {

  constructor(private accountService: AccountService , private router: Router , private userService :UsersService) { }

  accountType: string = '';
  currentSection: number = 1;
  client: User = new User();
  images: string[] = [];
  currentImageIndex: number = 0;
  currentImage: string = '';
  chosenImage :File | null = null;

  ngOnInit(): void {
    this.getUser();
    this.generateRib();
    this.generateExpirationDate();
  }

  fetchImages() {
    this.images = [
      '/assets/cards/card1.png', 
      '/assets/cards/card2.png',
      '/assets/cards/card3.png',
      '/assets/cards/card4.png',
      '/assets/cards/card5.png',
      '/assets/cards/card6.png',
      '/assets/cards/card7.png',
      '/assets/cards/card8.png',
      '/assets/cards/card9.png' 
    ];
    this.currentImageIndex = 0; // Reset current image index

    // get the element wuth id img-bg and make it hidden
    const bgCard = document.getElementById('card-bg');
    if (bgCard) {
      bgCard.style.display = 'none';
    }

  }

  getUser(): void {
    this.userService.getUserById(this.getAccountHolderIdFromLocalStorage()).then((user) => {
      if (user) {
        this.client = user;
        this.fetchImages();
      }
    });
  }
  
  setAccountType(accountType: string): void {
    this.accountType = accountType;
  }

  Submit(): void {
    const formData = {
      accountType: this.accountType,
      accountHolderId: this.getAccountHolderIdFromLocalStorage(),
      balance: 0,
      bankName: 'SOGE Bank'
    };

    const account : Account = new Account(
      0,
      this.generateRib(),
      formData.accountType,
      formData.accountHolderId,
      0,
      []
    );

    // get the chosen image from current image

    // load the current from assets folder and save it to the chosen image
    this.chosenImage = new File([this.currentImage], 'card.png', {type: 'image/png'});


    this.accountService.createAccount(account , this.chosenImage ).then(() => {
      window.location.href = '/myaccount';
    });
  }

  getAccountHolderIdFromLocalStorage(): string {
    return localStorage.getItem('UserId') ?? '';
  }

  rib: string = '';
  generateRib(): string {
    this.rib = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    return this.rib;
  }

  year: number = 0;
  month: number = 0;
  finalMonth: string = '';

  generateExpirationDate(): void {
    this.year = Math.floor(new Date().getFullYear() + Math.random() * 10);
    this.year = Number(this.year.toString().slice(2));
    this.month = Math.floor(1 + Math.random() * 12);
    this.finalMonth = this.month < 10 ? '0' + this.month.toString() : this.month.toString();
  }

  slideToSection2(): void {
    this.currentSection = 2;
  }

  public nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.currentImage = this.images[this.currentImageIndex];
    this.fadeOut();
  }

  public previousImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.currentImage = this.images[this.currentImageIndex];
    this.fadeOut();
  }

  
  private fadeOut(): void {
    const bgCard = document.getElementById('bg-card');
    if (bgCard) {
      bgCard.classList.remove('fade-in');
      bgCard.classList.add('fade-out');
      setTimeout(() => {
        bgCard.classList.remove('fade-out');
        bgCard.classList.add('fade-in');
      }, 500); // Adjust timing to match the transition duration
    }
  }
  
}
