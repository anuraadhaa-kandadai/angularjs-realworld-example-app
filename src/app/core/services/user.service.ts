import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments';
import { JwtService } from './jwt.service';

export interface User {
  username: string;
  email: string;
  token: string;
  bio: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtService = inject(JwtService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUser();
  }

  get isAuthenticated(): Observable<boolean> {
    return this.currentUser.pipe(
      map(user => !!user)
    );
  }

  loadUser(): void {
    const token = this.jwtService.get();
    if (token) {
      this.http.get<User>(`${environment.apiUrl}/user`, {
        headers: { Authorization: `Token ${token}` }
      }).pipe(
        tap(user => {
          console.log('User loaded successfully:', user);
          this.setAuth(user);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading user:', error);
          this.purgeAuth();
          return throwError(() => new Error('Failed to load user'));
        })
      ).subscribe();
    }
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    console.log('Attempting to login user:', credentials.email);
    return this.http.post<User>(`${environment.apiUrl}/users/login`, { user: credentials }).pipe(
      tap(user => {
        console.log('Login successful:', user);
        this.setAuth(user);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(credentials: { username: string; email: string; password: string }): Observable<User> {
    console.log('Attempting to register user:', credentials.username);
    return this.http.post<User>(`${environment.apiUrl}/users`, { user: credentials }).pipe(
      tap(user => {
        console.log('Registration successful:', user);
        this.setAuth(user);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  setAuth(userData: any): void {
    console.log('Setting auth for user:', userData);
    const user: User = userData.user || userData;
    this.currentUserSubject.next(user);
    this.jwtService.save(user.token);
  }

  purgeAuth(): void {
    this.currentUserSubject.next(null);
    this.jwtService.destroy();
  }

  logout(): void {
    this.purgeAuth();
    this.router.navigateByUrl('/');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  update(user: Partial<User>): Observable<User> {
    console.log('Attempting to update user:', user);
    return this.http.put<User>(`${environment.apiUrl}/user`, { user }).pipe(
      tap(updatedUser => {
        console.log('User update successful:', updatedUser);
        this.setAuth(updatedUser);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('User update error:', error);
        return throwError(() => new Error('User update failed'));
      })
    );
  }

  // TODO: Implement other methods as needed (e.g., verifyAuth, getUserProfile, etc.)
}