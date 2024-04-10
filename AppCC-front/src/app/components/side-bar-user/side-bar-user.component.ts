import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './side-bar-user.component.html',
  styleUrl: './side-bar-user.component.css'
})
export class SideBarUserComponent {
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
  goHome(){
    this.router.navigate(['/']);
    this.closeSidebar.emit();

  }
  applyLoan() {
    this.router.navigate(['/loan/createloan']);
    this.closeSidebar.emit();
  }

}