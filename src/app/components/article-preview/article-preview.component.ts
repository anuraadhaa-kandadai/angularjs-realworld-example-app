import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Article } from '../../core/models/article.model';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ArticlePreviewComponent {
  @Input() article!: Article;
}