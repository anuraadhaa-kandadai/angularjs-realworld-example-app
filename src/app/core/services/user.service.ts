import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { User, Credentials } from '../models/user.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  attemptAuth(type: string, credentials: Credentials): Observable<User> {
    const route = (type === 'login') ? '/login' : '';
    return this.http.post<{user: User}>(`${environment.api_url}/users${route}`, { user: credentials })
      .pipe(
        map(data => data.user),
        tap(user => this.setCurrentUser(user))
      );
  }

  update(user: Partial<User>): Observable<User> {
    return this.http.put<{user: User}>(`${environment.api_url}/user`, { user })
      .pipe(
        map(data => data.user),
        tap(updatedUser => this.setCurrentUser(updatedUser))
      );
  }

  logout(): void {
    this.setCurrentUser(null);
    this.router.navigateByUrl('/');
  }

  verifyAuth(): Observable<boolean> {
    return this.currentUser.pipe(map(user => !!user));
  }

  ensureAuthIs(requiredAuth: boolean): Observable<boolean> {
    return this.verifyAuth().pipe(
      tap(isAuth => {
        if (isAuth !== requiredAuth) {
          this.router.navigateByUrl(requiredAuth ? '/login' : '/');
        }
      })
    );
  }

  // Helper method to set current user
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }
}