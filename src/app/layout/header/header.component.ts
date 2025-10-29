import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../core/services/user.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe]
})
export class HeaderComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser$: Observable<User | null> = this.userService.currentUser;

  logout(): void {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }
}