import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments';
import { ArticleListComponent } from '../../components/article-list/article-list.component';
import { ArticleListConfig } from '../../core/models/article.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ArticleListComponent]
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);

  appName = environment.appName;
  listConfig: ArticleListConfig = { type: 'all', filters: {} };

  ngOnInit() {
    this.setListConfig();
  }

  setListConfig() {
    // For now, we'll just set it to 'all' without checking authentication
    this.listConfig = { type: 'all', filters: {} };
    // Uncomment and implement this when UserService is ready
    // this.userService.isAuthenticated.pipe(
    //   map(isAuth => isAuth ? 'feed' : 'all')
    // ).subscribe(listType => {
    //   this.listConfig = { type: listType, filters: {} };
    // });
  }

  changeList(config: Partial<ArticleListConfig>) {
    this.listConfig = { ...this.listConfig, ...config };
  }

  // Placeholder for authentication check
  isAuthenticated(): boolean {
    return false; // Replace with actual authentication check when UserService is ready
  }
}