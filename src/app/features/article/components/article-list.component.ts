import { Component, DestroyRef, inject, Input } from "@angular/core";
import { ArticlesService } from "../services/articles.service";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";
import { ArticlePreviewComponent } from "./article-preview.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { LoadingState } from "../../../core/models/loading-state.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-article-list",
  template: `
    @if (loading === LoadingState.LOADING) {
      <div class="article-preview">Loading articles...</div>
    }

    @if (loading === LoadingState.LOADED) {
      @for (article of results; track article.slug) {
        <app-article-preview [article]="article" />
      } @empty {
        <div class="article-preview">No articles are here... yet.</div>
      }

      <nav>
        <ul class="pagination">
          @for (pageNumber of totalPages; track pageNumber) {
            <li
              class="page-item"
              [ngClass]="{ active: pageNumber === currentPage }"
            >
              <button class="page-link" (click)="setPageTo(pageNumber)">
                {{ pageNumber }}
              </button>
            </li>
          }
        </ul>
      </nav>
    }
  `,
  imports: [ArticlePreviewComponent, NgForOf, NgClass, NgIf],
  styles: `
    .page-link {
      cursor: pointer;
    }
  `,
  standalone: true,
})
export class ArticleListComponent {
  query!: ArticleListConfig;
  results: Article[] = [];
  currentPage = 1;
  totalPages: Array<number> = [];
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroyRef = inject(DestroyRef);
  private previousConfigString = '';

  @Input() limit!: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      // Create a string representation of the config to detect meaningful changes
      const configString = JSON.stringify({
        type: config.type,
        filters: config.filters,
        refreshTrigger: (config as any).refreshTrigger
      });
      
      // Check if this is a meaningful change that should trigger a refresh
      const shouldRefresh = this.previousConfigString !== configString;
      
      this.query = config;
      this.currentPage = 1;
      
      // Store the current config string for future comparisons
      this.previousConfigString = configString;
      
      // Always run query when config changes, especially for authentication state changes
      if (shouldRefresh) {
        this.runQuery();
      }
    }
  }

  constructor(private articlesService: ArticlesService) {}

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = LoadingState.LOADING;
    this.results = [];

    // Create a clean copy of the query to avoid modifying the original
    const queryToExecute = { ...this.query };
    
    // Create limit and offset filter (if necessary)
    if (this.limit) {
      queryToExecute.filters = { ...this.query.filters };
      queryToExecute.filters.limit = this.limit;
      queryToExecute.filters.offset = this.limit * (this.currentPage - 1);
    }

    this.articlesService
      .query(queryToExecute)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.loading = LoadingState.LOADED;
        this.results = data.articles;

        // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
        this.totalPages = Array.from(
          new Array(Math.ceil(data.articlesCount / this.limit)),
          (val, index) => index + 1,
        );
      });
  }
}