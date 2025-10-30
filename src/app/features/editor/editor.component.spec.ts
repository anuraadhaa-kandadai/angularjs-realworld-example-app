import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditorComponent } from './editor.component';
import { ArticlesService } from '../../core/services/articles.service';
import { UserService } from '../../core/services/user.service';
import { of, throwError } from 'rxjs';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let mockArticlesService: jasmine.SpyObj<ArticlesService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockArticlesService = jasmine.createSpyObj('ArticlesService', ['save']);
    mockUserService = jasmine.createSpyObj('UserService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, EditorComponent],
      providers: [
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.articleForm.get('title')).toBeTruthy();
    expect(component.articleForm.get('description')).toBeTruthy();
    expect(component.articleForm.get('body')).toBeTruthy();
    expect(component.articleForm.get('tagList')).toBeTruthy();
  });

  it('should add a tag', () => {
    component.tagField.setValue('newtag');
    component.addTag();
    expect(component.articleForm.get('tagList')?.value).toContain('newtag');
  });

  it('should remove a tag', () => {
    component.articleForm.patchValue({ tagList: ['tag1', 'tag2'] });
    component.removeTag('tag1');
    expect(component.articleForm.get('tagList')?.value).not.toContain('tag1');
    expect(component.articleForm.get('tagList')?.value).toContain('tag2');
  });

  it('should submit the form successfully', () => {
    const article = {
      title: 'Test Article',
      description: 'Test Description',
      body: 'Test Body',
      tagList: ['tag1', 'tag2']
    };
    component.articleForm.setValue(article);
    mockArticlesService.save.and.returnValue(of({ ...article, slug: 'test-article' }));

    component.submitForm();

    expect(mockArticlesService.save).toHaveBeenCalledWith(article);
    expect(component.isSubmitting).toBeFalse();
    expect(component.errors).toEqual({});
  });

  it('should handle errors on form submission', () => {
    const error = { 'title': ['Title is required'] };
    mockArticlesService.save.and.returnValue(throwError(() => error));

    component.submitForm();

    expect(mockArticlesService.save).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
    expect(component.errors).toEqual(error);
  });
});