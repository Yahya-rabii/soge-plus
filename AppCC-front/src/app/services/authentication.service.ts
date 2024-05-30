import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}
  async login(username: string, password: string): Promise<any> {
    const loginUrl = `${environment.AuthapiUrl}${environment.loginEndpoint}`;
    const credentials = { username, password };
    try {
      const response = await this.httpClient
        .post<any>(loginUrl, credentials)
        .toPromise();
      this.setsessionStorage(response);
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
  async logout(): Promise<void> {
    const logoutUrl = `${environment.AuthapiUrl}${environment.logoutEndpoint}`;
    const userId = this.getUserId();
    try {
      const token = sessionStorage.getItem('access_token');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const response = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        this.clearsessionStorage();
        this.router.navigate(['/login']).then();
      } else {
        console.error('Error logging out:', response.statusText);
        this.clearsessionStorage();
        this.router.navigate(['/login']).then();
      }
    } catch (error) {
      this.clearsessionStorage();
      console.error('Error logging out:', error);
    }
  }
  isLoggedIn(): boolean {
    const accessToken = sessionStorage.getItem('access_token');
    return accessToken !== null;
  }
  /*
  async getRoles(): Promise<string[]> {
    const getRolesUrl = `${environment.AuthapiUrl}${environment.getRolesEndpoint}`;
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found in session storage');
    }
    const headers = new HttpHeaders({
      method: 'POST',
      'Authorization': `Bearer ${accessToken}`
    });
    try {
      const roles = await this.httpClient.post<string[]>(getRolesUrl, {}, { headers }).toPromise();
      return roles || []; 
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }
*/
  async getRoles(): Promise<string[]> {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found in session storage');
    }
    return new Promise<string[]>((resolve, reject) => {
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
        const roles = payloadJson.realm_access?.roles || [];
        resolve(roles);
      } catch (error) {
        console.error('Error decoding token or extracting roles:', error);
        reject(error);
      }
    });
  }
  getUserId(): string {
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
    return payloadJson.sub;
  }
  async isAdmin(): Promise<boolean> {
    try {
      const response = await this.getRoles();
      return response.includes('ADMIN');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
  public setsessionStorage(response: any): void {
    sessionStorage.setItem('access_token', response.access_token);
    sessionStorage.setItem('refresh_token', response.refresh_token);
    sessionStorage.setItem('expires_in', response.expires_in.toString());
    sessionStorage.setItem(
      'refresh_expires_in',
      response.refresh_expires_in.toString(),
    );
    sessionStorage.setItem('token_type', response.token_type);
  }
  private clearsessionStorage(): void {
    sessionStorage.clear();
  }
  async validateSecret(secret: string): Promise<boolean> {
    const userId = this.getUserId();
    const refreshToken = sessionStorage.getItem('refresh_token') || '';
    console.log('refreshToken', refreshToken);
    console.log('userId', userId);
    const validateSecretUrl = `${environment.AuthapiUrl}${environment.validateSecretEndpoint}${userId}`;
    try {
      const response = await fetch(validateSecretUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshToken, secretKey: secret }),
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('access_token', data.access_token);
        sessionStorage.setItem('refresh_token', data.refresh_token);
        sessionStorage.setItem('expires_in', data.expires_in.toString());
        sessionStorage.setItem(
          'refresh_expires_in',
          data.refresh_expires_in.toString(),
        );
        sessionStorage.setItem('token_type', data.token_type);
        return true;
      } else {
        console.error('Error verifying secret:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error verifying secret:', error);
      throw error;
    }
  }
}
function jwt_decode(accessToken: string): any {
  throw new Error('Function not implemented.');
}
