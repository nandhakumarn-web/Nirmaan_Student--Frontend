import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          this.notificationService.error('Session expired. Please login again.');
        } else if (error.status === 403) {
          this.notificationService.error('Access denied.');
        } else if (error.status === 0) {
          this.notificationService.error('Network error. Please check your connection.');
        } else {
          const message = error.error?.message || error.message || 'An error occurred';
          this.notificationService.error(message);
        }
        
        return throwError(error);
      })
    );
  }
}