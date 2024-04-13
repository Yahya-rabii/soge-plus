import { Component } from '@angular/core';
import  { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {

  //load the carousel images from the assets folder into a list of images
  
  images: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.images = [
      'assets/carousel/image1.png',
      'assets/carousel/image2.png',
      'assets/carousel/image3.png',
      'assets/carousel/image4.png',
  
      //todo :  the images are not well reloded
    ];}


}
