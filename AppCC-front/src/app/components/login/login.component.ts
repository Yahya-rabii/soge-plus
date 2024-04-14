import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Method to handle form submission
  public async Submit() {
    if (this.loginForm.invalid) {
      // Display appropriate error messages
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

    const formData = this.loginForm.value;
    try {
      await this.login(formData.username, formData.password);
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  }

  // Method to handle login
  public async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.authService.login(username, password).then();
      const rolesObject = await this.authService.getRoles().then();
      const rolesArray = rolesObject.roles;
      if (rolesArray.includes('ADMIN')) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }
    } catch (error) {
      throw error;
    }
  }
}
