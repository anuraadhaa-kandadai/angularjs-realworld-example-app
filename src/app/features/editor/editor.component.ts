import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService, Article } from '../../core/services/articles.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  articleForm: FormGroup;
  tagField = '';
  isSubmitting = false;
  errors: {[key: string]: string} = {};

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.articleForm = this.fb.group({
      title: [''],
      description: [''],
      body: [''],
      tagList: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data: {article?: Article}) => {
      if (data.article) {
        this.articleForm.patchValue(data.article);
        
        // Clear the existing tagList array
        const tagList = this.articleForm.get('tagList') as FormArray;
        tagList.clear();
        
        // Add each tag to the FormArray
        data.article.tagList.forEach((tag: string) => {
          tagList.push(this.fb.control(tag));
        });
      }
    });
  }

  get tagList() {
    return this.articleForm.get('tagList') as FormArray;
  }

  addTag() {
    if (this.tagField.trim() !== '' && !this.tagList.value.includes(this.tagField.trim())) {
      this.tagList.push(this.fb.control(this.tagField.trim()));
      this.tagField = '';
    }
  }

  removeTag(index: number) {
    this.tagList.removeAt(index);
  }

  submit() {
    this.isSubmitting = true;
    this.errors = {};

    const articleData = this.articleForm.value as Article;
    this.articlesService.save(articleData).subscribe(
      (article: Article) => this.router.navigate(['/article', article.slug]),
      (err: any) => {
        this.errors = err.error.errors;
        this.isSubmitting = false;
      }
    );
  }
}