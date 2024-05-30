import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
import { RibPipe } from '../../../pipes/rib.pipe';
import { Card } from '../../../models/card.model';
import { AuthenticationService } from '../../../services/authentication.service';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  standalone: true,
  imports: [CommonModule, RibPipe],
})
export class CreateAccountComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private router: Router,
    private userService: UsersService,
    private authService: AuthenticationService,
  ) {}
  accountType: string = '';
  currentSection: number = 1;
  client: User = new User();
  images: string[] = [];
  currentImageIndex: number = 0;
  currentImage: string = '';
  chosenImage: File | null = null;
  loadingImages: boolean = true;
  card: Card = new Card();
  ngOnInit(): void {
    this.getUser();
    this.generateRib();
    this.generateExpirationDate();
  }
  async fetchImages(): Promise<void> {
    await this.simulateLoadingDelay();
    this.images = [
      '/assets/cards/card1.jpg',
      '/assets/cards/card2.jpg',
      '/assets/cards/card3.jpg',
      '/assets/cards/card4.jpg',
      '/assets/cards/card5.jpg',
      '/assets/cards/card6.jpg',
      '/assets/cards/card7.jpg',
      '/assets/cards/card8.jpg',
      '/assets/cards/card9.jpg',
    ];
    this.currentImageIndex = 0;
    this.loadingImages = false;
  }
  async getUser(): Promise<void> {
    const userId = this.authService.getUserId();
    const user = await this.userService.getUserById(userId);
    if (user) {
      this.client = user;
      await this.fetchImages();
    }
  }
  setAccountType(accountType: string): void {
    this.accountType = accountType;
  }
  async Submit(): Promise<void> {
    const formData = {
      accountType: this.accountType,
      accountHolderId: this.authService.getUserId(),
      balance: 0,
      bankName: 'SOGE Bank',
    };
    this.rib = this.generateRib();
    const account: Account = new Account(
      0,
      this.getStringRibFromNumber(),
      formData.accountType,
      formData.accountHolderId,
      0,
      0,
      [],
    );
    const id: number = 0;
    this.card = new Card(
      id,
      this.month,
      this.year,
      this.rib,
      this.generateCvc(),
      this.generateSignature(),
    );
    if (this.currentImage) {
      this.chosenImage = new File([this.currentImage], 'card.jpg', {
        type: 'image/jpg',
      });
      await this.accountService.createAccount(
        account,
        this.chosenImage,
        this.card,
      );
      this.router.navigate(['/account/myaccount']).then(
        window.location.reload.bind(window.location),
      );
    }
  }
  rib: number = 0;
  generateRib(): number {
    this.rib = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    return this.rib;
  }
  getStringRibFromNumber(): string {
    return this.rib.toString();
  }
  cvc: number = 0;
  signature: number = 0;
  generateCvc(): number {
    this.cvc = Math.floor(100 + Math.random() * 900);
    return this.cvc;
  }
  generateSignature(): number {
    this.signature = Math.floor(1000 + Math.random() * 900);
    return this.signature;
  }
  year: number = 0;
  month: number = 0;
  finalMonth: string = '';
  generateExpirationDate(): void {
    this.year = Math.floor(new Date().getFullYear() + Math.random() * 10);
    this.year = Number(this.year.toString().slice(2));
    this.month = Math.floor(1 + Math.random() * 12);
    this.finalMonth =
      this.month < 10 ? '0' + this.month.toString() : this.month.toString();
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
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
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
      }, 500);
    }
  }
  private async simulateLoadingDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 10));
  }
}
