import { Injectable } from '@angular/core';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly JWT_KEY = environment.jwtKey;

  save(token: string): void {
    try {
      localStorage.setItem(this.JWT_KEY, token);
    } catch (e) {
      console.error('Error saving token to localStorage', e);
    }
  }

  get(): string | null {
    try {
      return localStorage.getItem(this.JWT_KEY);
    } catch (e) {
      console.error('Error getting token from localStorage', e);
      return null;
    }
  }

  destroy(): void {
    try {
      localStorage.removeItem(this.JWT_KEY);
    } catch (e) {
      console.error('Error removing token from localStorage', e);
    }
  }
}