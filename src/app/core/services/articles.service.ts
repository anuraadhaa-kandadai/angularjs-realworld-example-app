import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface ArticleListConfig {
  type: 'all' | 'feed';
  filters: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  query(config: ArticleListConfig): Observable<{articles: Article[], articlesCount: number}> {
    // Convert filters object to HttpParams
    let params = new HttpParams();
    Object.keys(config.filters).forEach((key: string) => {
      if (config.filters[key as keyof ArticleListConfig['filters']]) {
        params = params.set(key, config.filters[key as keyof ArticleListConfig['filters']]!.toString());
      }
    });

    return this.http.get<{articles: Article[], articlesCount: number}>(
      `${environment.api_url}/articles${config.type === 'feed' ? '/feed' : ''}`,
      { params }
    );
  }

  get(slug: string): Observable<Article> {
    return this.http.get<{article: Article}>(`${environment.api_url}/articles/${slug}`)
      .pipe(map(data => data.article));
  }

  destroy(slug: string): Observable<void> {
    return this.http.delete<void>(`${environment.api_url}/articles/${slug}`);
  }

  save(article: Article): Observable<Article> {
    if (article.slug) {
      return this.http.put<{article: Article}>(`${environment.api_url}/articles/${article.slug}`, { article })
        .pipe(map(data => data.article));
    } else {
      return this.http.post<{article: Article}>(`${environment.api_url}/articles`, { article })
        .pipe(map(data => data.article));
    }
  }

  favorite(slug: string): Observable<Article> {
    return this.http.post<{article: Article}>(`${environment.api_url}/articles/${slug}/favorite`, {})
      .pipe(map(data => data.article));
  }

  unfavorite(slug: string): Observable<Article> {
    return this.http.delete<{article: Article}>(`${environment.api_url}/articles/${slug}/favorite`)
      .pipe(map(data => data.article));
  }
}