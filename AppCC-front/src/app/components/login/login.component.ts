import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf directive
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , LoadingSpinnerComponent],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false; // State variable for loading spinner

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public async Submit() {
    if (this.loginForm.invalid) {
      if (this.loginForm.controls['password'].errors?.['minlength']) {
        alert('Password must be at least 8 characters long');
      }
      if (this.loginForm.controls['username'].errors?.['required']) {
        alert('Username is required');
      }
      if (this.loginForm.controls['password'].errors?.['required']) {
        alert('Password is required');
      }
      return;
    }

    this.isLoading = true; // Show loading spinner
    const formData = this.loginForm.value;
    try {
      await this.login(formData.username, formData.password);
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    } finally {
      this.isLoading = false; // Hide loading spinner
    }
  }

  navigateToRegister() {
    this.router.navigate(['/signup']).then();
  }

  public async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.authService.login(username, password).then();
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      throw error;
    }
  }
}
