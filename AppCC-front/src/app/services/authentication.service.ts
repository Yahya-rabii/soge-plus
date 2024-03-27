import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { TokenRefreshService } from './token-refresh.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient,
    private tokenRefreshService: TokenRefreshService
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
        catchError(error => {
          return throwError(error);
        })
      );
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return accessToken !== null;
  }
}
