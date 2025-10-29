import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article, ArticleListConfig } from '../models/article.model';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  query(config: ArticleListConfig): Observable<{ articles: Article[], articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();
    Object.keys(config.filters)
      .forEach((key) => {
        const value = config.filters[key as keyof typeof config.filters];
        if (value !== undefined) {
          params = params.set(key, value.toString());
        }
      });

    return this.http.get<{ articles: Article[], articlesCount: number }>(
      `${environment.apiUrl}/articles${config.type === 'feed' ? '/feed' : ''}`,
      { params }
    );
  }

  get(slug: string): Observable<Article> {
    return this.http.get<{ article: Article }>(`${environment.apiUrl}/articles/${slug}`)
      .pipe(map(data => data.article));
  }

  destroy(slug: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/articles/${slug}`);
  }

  save(article: Article): Observable<Article> {
    // If we're updating an existing article
    if (article.slug) {
      return this.http.put<{ article: Article }>(`${environment.apiUrl}/articles/${article.slug}`, { article })
        .pipe(map(data => data.article));
    } else {
      // Otherwise, create a new article
      return this.http.post<{ article: Article }>(`${environment.apiUrl}/articles`, { article })
        .pipe(map(data => data.article));
    }
  }

  favorite(slug: string): Observable<Article> {
    return this.http.post<{ article: Article }>(`${environment.apiUrl}/articles/${slug}/favorite`, {})
      .pipe(map(data => data.article));
  }

  unfavorite(slug: string): Observable<Article> {
    return this.http.delete<{ article: Article }>(`${environment.apiUrl}/articles/${slug}/favorite`)
      .pipe(map(data => data.article));
  }
}