import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { User } from '../../shared/models/user';
import { LoginRequest } from '../../shared/models/login-request';
import { ApiResponse } from '../../shared/models/api-resonse';
import { LoginResponse } from '../../shared/models/login-response';
import { Role } from '../../shared/models/role';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // Initialize current user from storage
    const user = this.storageService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            const user: User = {
              username: response.data.username,
              email: response.data.email,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              role: response.data.role,
            };

            this.storageService.saveToken(response.data.token);
            this.storageService.saveUser(user);
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getToken();
  }

  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }
}
