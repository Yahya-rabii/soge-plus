import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { SideBarComponent } from './layouts/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/header/header.component';
//router-outlet
import { Router, RouterOutlet } from "@angular/router";
import { DashboardComponent } from './views/dashboard/dashboard.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [ SideBarComponent , HeaderComponent , RouterOutlet , DashboardComponent],
  standalone: true

})
export class AdminComponent {
  title = 'event-bud-frontend';

  constructor(private element: ElementRef, private rendered: Renderer2 , private router: Router) {}

  @HostListener('click', ['$event.target']) onClick(e: Element) {
    const profileDropdown = this.element.nativeElement.querySelector('.profile-dropdown') as Element;

    if (!profileDropdown.contains(e)) {
      const profileDropdownList = this.element.nativeElement.querySelector('.profile-dropdown-list');
      this.rendered.setAttribute(profileDropdownList, 'aria-expanded', 'false')
    }
  }
}