import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '@env/environment';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, RouterLinkActive]
})
export class HeaderComponent {
  private userService = inject(UserService);

  appName: string = environment.appName;
  currentUser$: Observable<User | null> = this.userService.currentUser;

  logout() {
    this.userService.logout();
  }
}