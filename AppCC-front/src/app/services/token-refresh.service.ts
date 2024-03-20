import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {
  private readonly refreshTokenInterval = 60000; // Interval in milliseconds (e.g., 1 minute)
  private readonly tokenExpirationThreshold = 300000; // Threshold in milliseconds (e.g., 5 minutes)
  // private refreshTokenTimer: any;

  constructor(private httpClient: HttpClient) {
    // Start the token refresh interval when the service is initialized
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer() {
    // Use interval to periodically check for token expiration and refresh if necessary
    interval(this.refreshTokenInterval)
      .subscribe(() => {
        this.checkTokenExpiration();
      });
  }

  private checkTokenExpiration() {
    const expiresAt = localStorage.getItem('expires_in');
    const currentTime = Date.now();
    if (expiresAt && currentTime >= parseInt(expiresAt) - this.tokenExpirationThreshold) {
      // Access token is about to expire, refresh it
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        this.refreshAccessToken(refreshToken)
          .subscribe(
            response => {
              // Update the access token and other information in local storage
              localStorage.setItem('access_token', response.access_token);
              localStorage.setItem('refresh_token', response.refresh_token);
              localStorage.setItem('expires_in', response.expires_in.toString());
              localStorage.setItem('refresh_expires_in', response.refresh_expires_in.toString());
              localStorage.setItem('token_type', response.token_type);
            },
            error => {
              // Handle token refresh error
              console.error('Error refreshing token:', error);
            }
          );
      }
    }
  }

  private refreshAccessToken(refreshToken: string): Observable<any> {
    const refreshTokenUrl = `${environment.apiUrl}${environment.refreshEndpoint}`;

    return this.httpClient.post<any>(refreshTokenUrl, { refresh_token: refreshToken })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
