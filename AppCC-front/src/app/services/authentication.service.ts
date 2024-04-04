import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { TokenRefreshService } from './token-refresh.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient,
    private tokenRefreshService: TokenRefreshService, 
    private router: Router
  ) { }

  login(username: string, password: string): Observable<any> {
    const loginUrl = `${environment.AuthapiUrl}${environment.loginEndpoint}`;
    const credentials = { username, password };

    return this.httpClient.post<any>(loginUrl, credentials)
      .pipe(
        tap(response => {
          // Set data to local storage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('expires_in', response.expires_in.toString());
          localStorage.setItem('refresh_expires_in', response.refresh_expires_in.toString());
          localStorage.setItem('token_type', response.token_type);
          localStorage.setItem('UserId', response.UserId);
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  signup(user: User): Observable<any> {
    const signupUrl = `${environment.AuthapiUrl}${environment.signupEndpoint}`;

    return this.httpClient.post<any>(signupUrl, user)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  logout(): Observable<any> {
    const logoutUrl = `${environment.AuthapiUrl}${environment.logoutEndpoint}`;
    const userId = localStorage.getItem('UserId') || '{}' ;
    return this.httpClient.post<any>(logoutUrl, userId)
      .pipe(
    
        // Clear data from local storage
        tap(() => {
          localStorage.clear();
          window.location.href = "/login"
        }),
        catchError(error => {
          return throwError(error);
        })
      );
    
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return accessToken !== null;
  }

  // get role of the user using userId from local storage and send in as a requestbody getRoles is already implemented in the backend 
  //and it returns a list of roles for the user
  getRoles(): Observable<any> {
    const getRolesUrl = `${environment.AuthapiUrl}${environment.getRolesEndpoint}`;
    const userId = localStorage.getItem('UserId') || '{}' ;
    return this.httpClient.post<any>(getRolesUrl, userId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.getRoles().pipe(
      map(answ => {
        // Check if the roles array contains the admin role
        if (answ.roles.includes('ADMIN')) {
          return true;
        }
        else {
          return false;
        }
      }),
      catchError(error => {
        // Handle errors
        console.error('Error checking admin status:', error);
        return of(false); // Return false in case of error
      })
    );
  }
  
  
}
