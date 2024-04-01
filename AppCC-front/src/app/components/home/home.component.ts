import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { UserstableComponent } from '../userstable/userstable.component';
import { AnimationSnowflakeComponent } from '../../animations/animation-snowflake/animation-snowflake.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , CarouselComponent, UserstableComponent , AnimationSnowflakeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor() {}
}
