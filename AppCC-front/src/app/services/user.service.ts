import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: User[] = [];

  async getUsers(): Promise<User[]> {
    const url = `${environment.ClientMsUrl}${environment.getAllclientsEndpoint}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const users: User[] = data.map((user: any) => {
          return new User(user.id, user.firstName + ' ' + user.lastName, user.firstName, user.lastName, user.email, user.hasAccount, user.rib, user.credentials, user.address);
        });
        return users;

      }
      else {
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
        const response = await fetch(url);
     
          const data = await response.json();
          


            const user = new User(data.id, data.firstName + ' ' + data.lastName, data.firstName, data.lastName, data.email, data.hasAccount, data.rib, data.credentials, data.address);
            return user;
          
        

      
    } catch (error) {
      console.error('Error fetching user:', error);
      return new User();
    }
  }

}