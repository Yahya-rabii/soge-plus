import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

  standalone: true,
  imports: []
})
export class HeaderComponent {
  constructor(private authService: AuthenticationService, private router: Router) {}
  
  logout() {
    this.authService.logout().subscribe(
      (response) => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      (error) => {
        alert('An error occurred while logging out');
      }
    );
  }

}
