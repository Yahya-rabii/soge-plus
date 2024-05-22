import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  async login(username: string, password: string): Promise<any> {
    const loginUrl = `${environment.AuthapiUrl}${environment.loginEndpoint}`;
    const credentials = { username, password };

    try {
      const response = await this.httpClient.post<any>(loginUrl, credentials).toPromise();
      this.setLocalStorage(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signup(user: User): Promise<any> {
    const signupUrl = `${environment.AuthapiUrl}${environment.signupEndpoint}`;

    try {
      return await this.httpClient.post<any>(signupUrl, user).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<any> {
    const logoutUrl = `${environment.AuthapiUrl}${environment.logoutEndpoint}`;
    const userId = localStorage.getItem('UserId') || '{}';

    try {
      await this.httpClient.post<any>(logoutUrl, userId).toPromise();
      this.clearLocalStorage();
      window.location.href = "/login";
    } catch (error) {
      this.clearLocalStorage();
      throw error;
    }
  }

   isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return accessToken !== null;
  }

  async getRoles(): Promise<any> {
    const getRolesUrl = `${environment.AuthapiUrl}${environment.getRolesEndpoint}`;
    const userId = localStorage.getItem('UserId') || '{}';

    try {
      return await this.httpClient.post<any>(getRolesUrl, userId, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).toPromise();
    } 
    catch (error) {
      throw error;
    }
  }

  async isAdmin(): Promise<boolean> {
    try {
      const response = await this.getRoles();
      return response.roles.includes('ADMIN');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  private setLocalStorage(response: any): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('expires_in', response.expires_in.toString());
    localStorage.setItem('refresh_expires_in', response.refresh_expires_in.toString());
    localStorage.setItem('token_type', response.token_type);
    localStorage.setItem('UserId', response.UserId);
  }

  private clearLocalStorage(): void {
    localStorage.clear();
  }
}
