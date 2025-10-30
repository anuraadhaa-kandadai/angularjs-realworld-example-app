import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { ArticlesService } from '../../core/services/articles.service';
import { Article } from '../../core/models/article.model';
import { CommentsService, Comment } from '../../core/services/comments.service';
import { UserService, User } from '../../core/services/user.service';
import { ListErrorsComponent } from '../../shared/list-errors.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ListErrorsComponent],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private articles = inject(ArticlesService);
  private commentsApi = inject(CommentsService);
  private sanitizer = inject(DomSanitizer);
  private title = inject(Title);
  private userService = inject(UserService);

  slug = '';
  article = signal<Article | null>(null);
  articleHtml = signal<SafeHtml | null>(null);
  comments = signal<Comment[]>([]);
  currentUser = signal<User | null>(null);
  isAuthed = this.userService.isAuthenticated;

  isSubmitting = signal(false);
  commentBody = signal('');
  errors = signal<string[] | null>(null);

  ngOnInit(): void {
    this.userService.currentUser.subscribe(u => this.currentUser.set(u));
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      this.loadArticle(this.slug);
      this.loadComments(this.slug);
    });
  }

  ngOnDestroy(): void {}

  private loadArticle(slug: string) {
    this.articles.get(slug).subscribe({
      next: (art) => {
        this.article.set(art);
        this.title.setTitle(art.title);
        const html = marked.parse(art.body || '');
        this.articleHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      },
      error: () => {
        this.article.set(null);
        this.articleHtml.set(null);
      }
    });
  }

  private loadComments(slug: string) {
    this.commentsApi.getAll(slug).subscribe({
      next: (cmts) => this.comments.set(cmts),
      error: () => this.comments.set([])
    });
  }

  addComment(): void {
    const body = (this.commentBody() || '').trim();
    if (!body) return;
    this.isSubmitting.set(true);
    this.errors.set(null);

    this.commentsApi.add(this.slug, body).subscribe({
      next: (cmt) => {
        this.comments.set([cmt, ...this.comments()]);
        this.commentBody.set('');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const msgs: string[] = err?.error?.errors
          ? Object.entries(err.error.errors).flatMap(([k, v]) => Array.isArray(v) ? v.map(s => `${k} ${s}`) : `${k} ${v}`)
          : ['Unable to post comment'];
        this.errors.set(msgs);
        this.isSubmitting.set(false);
      }
    });
  }

  deleteComment(cmt: Comment, index: number): void {
    this.commentsApi.destroy(this.slug, cmt.id).subscribe({
      next: () => {
        const copy = [...this.comments()];
        copy.splice(index, 1);
        this.comments.set(copy);
      }
    });
  }

  isOwner(cmt: Comment): boolean {
    const u = this.currentUser();
    return !!u && cmt.author?.username === u.username;
  }
}


