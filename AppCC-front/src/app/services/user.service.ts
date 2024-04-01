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

      
      const users: User[] = data.map((user: { id: string | undefined; name: string | undefined; email: string | undefined; }) => new User(user.id, user.name ,user.email));
      console.log('Users:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }


  async getUserById(id: string): Promise<User> {
    const url = `${environment.ClientMsUrl}${environment.getClientByIdEndpoint}/${id}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const user = new User(data.id, data.name, data.email);
      console.log('User:', user);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  


  

}