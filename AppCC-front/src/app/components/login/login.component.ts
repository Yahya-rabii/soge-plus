import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Method to handle form submission
  public Submit() {
    if (this.loginForm.invalid) {
      console.log(this.loginForm.value );
      // the form is invalid 
      // check if the password is less than 8 characters
      if (this.loginForm.controls['password'].errors?.['minlength']) {
        alert('Password must be at least 8 characters long');
      }

      // check if the username is empty
      if (this.loginForm.controls['username'].errors?.['required']) {
        alert('Username is required');
      }

      // check if the password is empty

      if (this.loginForm.controls['password'].errors?.['required']) {
        alert('Password is required');
      }


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
        window.location.href = '/';
        
      },
      (error) => {
        console.log(error);
        alert('Wrong username or password');
      }
    );
  }

}

  
