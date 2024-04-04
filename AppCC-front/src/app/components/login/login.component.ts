import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';

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
    this.authService.login(username, password).subscribe(
      () => {
        this.authService.getRoles().subscribe((rolesObject: { roles: string[] }) => {
          const rolesArray = rolesObject.roles;
          if (rolesArray.includes('ADMIN')) {
           window.location.href = "/admin"
          } else {
            
            window.location.href = "/"
          }
        }, error => {
          console.error('Error fetching user roles:', error);
          // Handle error appropriately, e.g., show an error message or navigate to a fallback route
          this.router.navigate(['/error']); // Example of navigating to an error page
        });
      },
      (error) => {
        console.error('Error logging in:', error);
        alert('Wrong username or password');
      }
    );
  }
  

}

  
