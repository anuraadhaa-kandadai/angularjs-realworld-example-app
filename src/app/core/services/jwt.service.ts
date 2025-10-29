import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly tokenKey: string = environment.jwtTokenName;

  save(token: string): void {
    window.localStorage.setItem(this.tokenKey, token);
  }

  get(): string | null {
    return window.localStorage.getItem(this.tokenKey);
  }

  destroy(): void {
    window.localStorage.removeItem(this.tokenKey);
  }
}