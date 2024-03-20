import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginUrl = `${environment.apiUrl}${environment.loginEndpoint}`;
    const credentials = { email, password };

    return this.httpClient.post<any>(loginUrl, credentials)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  signup(user: User): Observable<any> {
    const signupUrl = `${environment.apiUrl}${environment.signupEndpoint}`;

    return this.httpClient.post<any>(signupUrl, user)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  logout(userId: string): Observable<any> {
    const logoutUrl = `${environment.apiUrl}${environment.logoutEndpoint}`;

    return this.httpClient.post<any>(logoutUrl, { UserId: userId })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    const refreshTokenUrl = `${environment.apiUrl}${environment.refreshEndpoint}`;

    return this.httpClient.post<any>(refreshTokenUrl, { refresh_token: refreshToken })
      .pipe(
        switchMap(response => {
          // Replace the access token in local storage with the new one
          localStorage.setItem('accessToken', response.access_token);
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
