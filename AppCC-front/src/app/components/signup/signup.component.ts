import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';
import { Credential } from '../../models/credential.model';
import { Address } from '../../models/address.model';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

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
  currentSection: number = 1; // Track current section of the form

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  // Method to handle form submission
  public async Submit() {
    if (this.signupForm.invalid) {
      alert('Please enter valid details');
      return;
    }

    const formData = this.signupForm.value;

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const credentials = [new Credential('password', formData.password)];
    const postalCode = parseInt(formData.postalCode);
    const address = new Address(formData.street, formData.city, postalCode, formData.country);
    const { username, firstName, lastName, email } = formData;

    this.user.set_attributes(
      username,
      firstName,
      lastName,
      email,
      credentials,
      address
    );

    try {
      await this.signUp(this.user);
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
      alert('An error occurred while signing up');
    }
  }

  // Method to handle signup
  public async signUp(user: User) {
    try {
      await this.authService.signup(user);
    } catch (error) {
      throw error;
    }
  }


  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Method to navigate to next form section
  public NextSection() {
    if (this.currentSection === 1) {
      // Validate user info fields
      const emailControl = this.signupForm.get('email');
      const usernameControl = this.signupForm.get('username');
      const firstNameControl = this.signupForm.get('firstName');
      const lastNameControl = this.signupForm.get('lastName');

      if (emailControl && usernameControl && firstNameControl && lastNameControl &&
          emailControl.valid && usernameControl.valid && firstNameControl.valid && lastNameControl.valid) {
        this.currentSection = 2;
        const userInfoSection = document.getElementById('userInfoSection');
        if (userInfoSection) {
          userInfoSection.style.display = 'none';
        }
        const credentialsSection = document.getElementById('credentialsSection');
        if (credentialsSection) {
          credentialsSection.style.display = 'block';
        }
      } else {
        alert('Please fill all fields in this section');
      }
    } else if (this.currentSection === 2) {
      // Validate credentials fields
      if (this.signupForm.get('password')?.valid && this.signupForm.get('confirmPassword')?.valid) {
       if (this.signupForm.get('password')?.value === this.signupForm.get('confirmPassword')?.value) {
       
        this.currentSection = 3;
        const credentialsSection = document.getElementById('credentialsSection');
        const addressSection = document.getElementById('addressSection');
        const nextButton = document.getElementById('nextButton');
        const submitButton = document.getElementById('submitButton');
        
        if (credentialsSection) {
          credentialsSection.style.display = 'none';
        }
        if (addressSection) {
          addressSection.style.display = 'block';
        }
        if (nextButton) {
          nextButton.style.display = 'none';
        }
        if (submitButton) {
          submitButton.style.display = 'block';
        }
      }
      else {
        alert('Passwords do not match');
      }
      } else {
        alert('Please fill all fields in this section');
      }
    }
  }
}
