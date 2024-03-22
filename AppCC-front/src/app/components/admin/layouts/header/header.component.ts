import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Images } from '../../../../../assets/data/images';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
})
export class HeaderComponent {
  public userOne: string = Images.users.userOne;
  
  isOpen: boolean = false;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  onClickProfile = () => {
    const profileDropdownList = this.element.nativeElement.querySelector(
      '.profile-dropdown-list'
    );
    this.renderer.setAttribute(profileDropdownList, 'aria-expanded', 'true');
  };
}
