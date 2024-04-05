import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './side.bar.admin.component.html',
  styleUrl: './side.bar.admin.component.css'
})
export class SideBarAdminComponent {
  constructor(private authService: AuthenticationService, private router: Router) {}
  @Output() closeSidebar = new EventEmitter<void>();
  showDropdown = false;
  onClose() {
    this.closeSidebar.emit();
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

}