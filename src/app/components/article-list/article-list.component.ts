import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../../core/services/articles.service';
import { Article, ArticleListConfig } from '../../core/models/article.model';
import { ArticlePreviewComponent } from '../article-preview/article-preview.component';
import { ListPaginationComponent } from '../list-pagination/list-pagination.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  standalone: true,
  imports: [CommonModule, ArticlePreviewComponent, ListPaginationComponent]
})
export class ArticleListComponent implements OnInit, OnDestroy {
  @Input() limit!: number;
  @Input() set listConfig(config: ArticleListConfig | null) {
    if (config) {
      this.query = { ...config };
      this.currentPage = 1;
      this.runQuery();
    }
  }

  query: ArticleListConfig = {
    type: 'all',
    filters: {
      limit: 10,
      offset: 0
    }
  };

  articles: Article[] = [];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [];
  private articleSubscription?: Subscription;

  constructor(private articlesService: ArticlesService) {}

  ngOnInit() {
    this.runQuery();
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = true;
    this.articles = [];

    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset = (this.currentPage - 1) * this.limit;
    }
    
    this.articleSubscription = this.articlesService.query(this.query).subscribe({
      next: (data: { articles: Article[], articlesCount: number }) => {
        this.loading = false;
        this.articles = data.articles;

        // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
        this.totalPages = Array.from(new Array(Math.ceil(data.articlesCount / this.limit)), (val, index) => index + 1);
      },
      error: (error: any) => {
        console.error('Error fetching articles', error);
        this.loading = false;
      }
    });
  }
}