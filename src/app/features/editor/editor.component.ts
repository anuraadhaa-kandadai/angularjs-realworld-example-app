import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, catchError, tap, of } from 'rxjs';
import { ArticlesService } from '../../core/services/articles.service';
import { UserService } from '../../core/services/user.service';
import { Article } from '../../core/models/article.model';
// TODO: Uncomment and import TagsService once it's migrated
// import { TagsService } from '../../core/services/tags.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditorComponent implements OnInit, OnDestroy {
  private articlesService = inject(ArticlesService);
  private userService = inject(UserService);
  // TODO: Uncomment once TagsService is migrated
  // private tagsService = inject(TagsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  articleForm: FormGroup;
  tagField = new FormControl('');
  errors: {[key: string]: string[]} = {};
  isSubmitting = false;
  private subscriptions: Subscription[] = [];

  constructor() {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      body: ['', [Validators.required]],
      tagList: [[]]
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        if (params['slug']) {
          this.loadArticle(params['slug']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadArticle(slug: string) {
    this.articlesService.get(slug).pipe(
      tap(article => {
        this.articleForm.patchValue(article);
      }),
      catchError(err => {
        this.router.navigateByUrl('/');
        return of(null);
      })
    ).subscribe();
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = {};

    const articleData: Partial<Article> = this.articleForm.value;
    this.articlesService.save(articleData as Article).pipe(
      tap(article => {
        // Navigate to the article page
        this.router.navigateByUrl('/article/' + article.slug);
        // Then navigate to the home page after a short delay
        // setTimeout(() => {
        //   this.router.navigateByUrl('/');
        // }, 100);
      }),
      catchError(err => {
        this.errors = err;
        this.isSubmitting = false;
        return of(null);
      })
    ).subscribe();
  }

  addTag() {
    const tag = this.tagField.value?.trim();
    if (tag && this.articleForm.get('tagList')?.value.indexOf(tag) < 0) {
      const tagList = this.articleForm.get('tagList')?.value as string[] || [];
      this.articleForm.patchValue({ tagList: [...tagList, tag] });
    }
    this.tagField.reset('');
  }

  removeTag(tag: string) {
    const tagList = this.articleForm.get('tagList')?.value as string[] || [];
    this.articleForm.patchValue({ tagList: tagList.filter(t => t !== tag) });
  }

  // TODO: Implement additional methods as needed
}