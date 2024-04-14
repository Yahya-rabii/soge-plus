import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {

  images: string[] = [];
  currentImageIndex: number = 0;
  intervalId: any;

  constructor(private authService : AuthenticationService) { }

  ngOnInit(): void {


     // if the user is not an admin, call the getUser method
     if (this.isLoggedIn()) {
      this.authService.isAdmin().then((isAdmin) => {
        if (!isAdmin) {
          this.images = [
            'assets/carousel/image1.png',
            'assets/carousel/image2.png',
            'assets/carousel/image3.png',
            'assets/carousel/image4.png',
          ];
        }
      });
    }
    
    this.startAutoSlide();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }

  stopAutoSlide(): void {
    clearInterval(this.intervalId);
  }

  prevSlide(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  nextSlide(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentImageIndex = index;
  }
}
