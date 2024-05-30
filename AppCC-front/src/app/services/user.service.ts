import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../environments/environment';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private authService: AuthenticationService) {}
  users: User[] = [];
  async getUsers(): Promise<User[]> {
    const url = `${environment.ClientMsUrl}${environment.getAllclientsEndpoint}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data = await response.json();
        const users: User[] = data.map((user: any) => {
          return new User(
            user.id,
            user.firstName + ' ' + user.lastName,
            user.firstName,
            user.lastName,
            user.email,
            user.emailVerified,
            user.hasAccount,
            user.rib,
            user.credentials,
            user.address,
          );
        });
        return users;
      } else {
        console.error('Error fetching users:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  async getUserById(UserId: string): Promise<User> {
    const id = UserId;
    const url = `${environment.ClientMsUrl}${environment.getClientByIdEndpoint}${id}`;
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data = await response.json();
        return new User(
          data.id,
          data.firstName + ' ' + data.lastName,
          data.firstName,
          data.lastName,
          data.email,
          data.emailVerified,
          data.hasAccount,
          data.rib,
          data.credentials,
          data.address,
        );
      } else {
        console.log('Error fetching user:', response);
        return new User();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return new User();
    }
  }

  getUserEmailVerified(): boolean {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found in session storage');
    }
    try {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length < 2) {
        throw new Error('Invalid JWT token');
      }
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(
        encodedPayload.replace(/-/g, '+').replace(/_/g, '/'),
      );
      const payloadJson = JSON.parse(decodedPayload);
      const emailVerified = payloadJson.email_verified;
      return emailVerified;
    } catch (error) {
      console.error('Error decoding token or extracting roles:', error);
      return false;
    }
  }


  getUser(): User {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found in session storage');
    }
    const tokenParts = accessToken.split('.');
    if (tokenParts.length < 2) {
      throw new Error('Invalid JWT token');
    }
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(
      encodedPayload.replace(/-/g, '+').replace(/_/g, '/'),
    );
    const payloadJson = JSON.parse(decodedPayload);
    const user : User =  new User(payloadJson.sub , payloadJson.preferred_username, payloadJson.given_name , payloadJson.family_name, payloadJson.email, payloadJson.email_verified, false, undefined, undefined, undefined);
    return user;
  }
}
