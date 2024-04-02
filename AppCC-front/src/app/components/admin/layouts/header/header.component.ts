import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class HeaderComponent implements OnInit{
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const drawerNavigation = document.getElementById('drawer-navigation');
    if (drawerNavigation) {
      drawerNavigation.setAttribute('data-drawer-show', 'none');
    }
  }


  toggleSidebar() {
    const drawerNavigation = document.getElementById('drawer-navigation');
    if (drawerNavigation) {
      const isDrawerOpen = drawerNavigation.getAttribute('data-drawer-show') === 'drawer-navigation';
      const newDrawerState = isDrawerOpen ? 'none' : 'drawer-navigation';
      drawerNavigation.setAttribute('data-drawer-show', newDrawerState);
    }
  }

  toggleUserDropdown() {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    if (dropdownAvatar) {
      const isDropdownOpen = dropdownAvatar.classList.contains('hidden');
      this.renderer.setStyle(dropdownAvatar, 'display', isDropdownOpen ? 'block' : 'none');
    }
  }
}
