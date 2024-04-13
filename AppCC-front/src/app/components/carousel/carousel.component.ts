import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {

  // Load the carousel images from the assets folder into a list of images
  images: string[] = [];
  imagesLoaded: Promise<boolean> | undefined;

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.imagesLoaded = this.loadImages();
    await this.imagesLoaded;
  }

  private async loadImages(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const imagePromises: Promise<boolean>[] = [];

      this.images = [
        'assets/carousel/image1.png',
        'assets/carousel/image2.png',
        'assets/carousel/image3.png',
        'assets/carousel/image4.png',
      ];

      this.images.forEach((imageUrl: string) => {
        const imagePromise = this.loadImage(imageUrl);
        imagePromises.push(imagePromise);
      });

      Promise.all(imagePromises)
        .then(() => resolve(true))
        .catch(() => reject(false));
    });
  }

  private loadImage(imageUrl: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = imageUrl;
    });
  }
}
