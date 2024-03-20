import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule]
})




export class LoginComponent {

  loginForm: FormGroup;
  username: string = '';
  password: string  ='';

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService , private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Method to handle form submission
  public Submit() {
    if (this.loginForm.invalid) {
      console.log(this.loginForm.value );
      alert('Please enter valid details');
      return;
    }
    const formData = this.loginForm.value;
    this.username=formData.username;
    this.password=formData.password;
    this.login(this.username, this.password);

  }

  // Method to handle login
  public login(username: string, password: string) {
    this.authService.login( username, password).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        alert('An error occurred while logging in');
      }
    );
  }

}

  
