import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments';

export interface CommentAuthor {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: CommentAuthor;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private http = inject(HttpClient);

  getAll(slug: string): Observable<Comment[]> {
    return this.http
      .get<{ comments: Comment[] }>(`${environment.apiUrl}/articles/${slug}/comments`)
      .pipe(map(res => res.comments));
  }

  add(slug: string, body: string): Observable<Comment> {
    return this.http
      .post<{ comment: Comment }>(`${environment.apiUrl}/articles/${slug}/comments`, { comment: { body } })
      .pipe(map(res => res.comment));
  }

  destroy(slug: string, id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/articles/${slug}/comments/${id}`);
  }
}


