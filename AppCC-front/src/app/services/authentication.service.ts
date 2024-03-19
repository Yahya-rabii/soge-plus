import { Injectable } from '@angular/core';
import{ User } from '../models/user.model';
import { UsersService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private userService: UsersService) { }


  // the login logic will be implemented  in the backend service here i just want to send its credentials to the backend and be sure that the user is authenticated and then get the jwt token from the backend and store it in the local storage
  



} 
