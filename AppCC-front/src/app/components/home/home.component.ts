import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { UserstableComponent } from '../userstable/userstable.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , CarouselComponent, UserstableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'App-CC';
}
