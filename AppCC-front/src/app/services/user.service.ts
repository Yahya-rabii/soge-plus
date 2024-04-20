import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users : User[] = [];

  async getUsers(): Promise<User[]> {
    const url = `${environment.ClientMsUrl}${environment.getAllclientsEndpoint}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const users: User[] = data.map((user: any) => {
        return new User(user.id , user.firstName+' '+user.lastName, user.firstName, user.lastName, user.email ,user.hasAccount, user.rib, user.credentials, user.address);
      });
      console.log(users);
      return users;

    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }


  async getUserById(UserId : string): Promise<User> {
    const id = UserId;
    const url = `${environment.ClientMsUrl}${environment.getClientByIdEndpoint}/${id}`;
    try {
      const response = await fetch(url);
  
      // Check if response status is ok
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }
  
      // Check if response body is empty
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Empty or invalid response from server');
      }
      const data = await response.json();

      

      console.log(data);
      const user = new User(data.id ,data.firstName + ' ' + data.lastName, data.firstName, data.lastName, data.email, data.hasAccount , data.rib, data.credentials, data.address);
      console.log("dsqddsds"+user);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
  
}