import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';
import { Credential } from '../../models/credential.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class SignupComponent {

  signupForm: FormGroup;
  user: User = new User();
  credentials: Credential[] | undefined;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService , private router: Router) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  // Method to handle form submission
  public Submit() {
    if (this.signupForm.invalid) {
      alert('Please enter valid details');
      return;
    }

    const formData = this.signupForm.value;

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.credentials = [new Credential( 'password' ,formData.password)];

    this.user.set_attributes(
      formData.username,
      formData.firstName,
      formData.lastName,
      formData.email,
      this.credentials
    );
    
    this.signUp(this.user);

  
  }

  // Method to handle signup
  public signUp(user: User) {
    console.log(user);
    this.authService.signup(user).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        alert('An error occurred while signing up');
      }
    );
  }

}

  
