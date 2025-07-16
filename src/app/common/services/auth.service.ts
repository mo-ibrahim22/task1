import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  AuthResponse,
  SignupRequest,
  SigninRequest,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadUserFromStorage();
  }

  signup(signupData: SignupRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/v1/auth/signup`, signupData)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  signin(signinData: SigninRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/v1/auth/signin`, signinData)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.userSubject.next(response.user);
    this.tokenSubject.next(response.token);
    this.isLoadingSubject.next(false);

    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      this.userSubject.next(JSON.parse(user));
      this.tokenSubject.next(token);
    }
  }

  logout(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    this.isLoadingSubject.next(false);

    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get currentToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentToken;
  }

  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      // You can emit an event or use a router to redirect to login

      return false;
    }
    return true;
  }
}
