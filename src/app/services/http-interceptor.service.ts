import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserProfile } from '../model/user-profile.model';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request URL is '/public/auth'
    if (req.url.endsWith('/public/auth') || req.url.endsWith('?rt')) {
      // Pass the request through without modifying it
      return next.handle(req);
    }

    // Get the userProfile from the authentication service
    const userProfile: UserProfile | null = this.authService.userProfile;

    // If userProfile is null, proceed without adding headers
    if (!userProfile) {
      return next.handle(req);
    }

    // Clone the request and add the Authorization header with the access token
    const accessToken = userProfile.accessToken;
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // Intercept the response to handle token refresh
    return next.handle(req).pipe(
      catchError((error: any) => {
        // Check if the error is due to an unauthorized request (expired token)
        if (error.status === 401) {
          // Get the refresh token from the userProfile
          const refreshToken = userProfile.refreshToken;

          // If there is no refresh token, logout the user
          if (!refreshToken) {
            this.authService.logout();
            return throwError('Refresh token is missing. User logged out.');
          }

          // Attempt to refresh the tokens
          return this.authService.refreshToken(refreshToken).pipe(
            switchMap((token) => {
              // Update the userProfile with the new token
              this.authService.authenticateUser(token);

              // Update the access token and attempt to resend the original request
              const updatedAccessToken = this.authService.userProfile?.accessToken;
              if (updatedAccessToken) {
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${updatedAccessToken}`,
                  },
                });
              }

              return next.handle(req);
            }),
            catchError((refreshError: any) => {
              // If the refresh token is also expired or the refresh request fails,
              // logout the user and throw an error.
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        } else {
          // For other error cases, propagate the error to the application
          return throwError(error);
        }
      })
    ) as Observable<HttpEvent<any>>;
  }
}
