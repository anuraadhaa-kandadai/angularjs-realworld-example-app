import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EditorComponent } from './editor.component';
import { ArticlesService, Article } from '../../core/services/articles.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let mockArticlesService: jasmine.SpyObj<ArticlesService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockArticlesService = jasmine.createSpyObj('ArticlesService', ['save']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      data: of({})
    };

    await TestBed.configureTestingModule({
      declarations: [ EditorComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ArticlesService, useValue: mockArticlesService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.articleForm.get('title')).toBeTruthy();
    expect(component.articleForm.get('description')).toBeTruthy();
    expect(component.articleForm.get('body')).toBeTruthy();
    expect(component.articleForm.get('tagList')).toBeTruthy();
  });

  it('should add a tag', () => {
    component.tagField = 'newtag';
    component.addTag();
    expect(component.tagList.length).toBe(1);
    expect(component.tagList.at(0).value).toBe('newtag');
  });

  it('should remove a tag', () => {
    component.tagField = 'tag1';
    component.addTag();
    component.tagField = 'tag2';
    component.addTag();
    expect(component.tagList.length).toBe(2);
    component.removeTag(0);
    expect(component.tagList.length).toBe(1);
    expect(component.tagList.at(0).value).toBe('tag2');
  });

  it('should submit the form', () => {
    const articleData: Pick<Article, 'title' | 'description' | 'body' | 'tagList'> = {
      title: 'Test Title',
      description: 'Test Description',
      body: 'Test Body',
      tagList: ['tag1', 'tag2']
    };
    component.articleForm.patchValue(articleData);
    const fullArticle: Article = {
      ...articleData,
      slug: 'test-title',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'testuser',
        bio: 'Test Bio',
        image: 'test-image.jpg',
        following: false
      }
    };
    mockArticlesService.save.and.returnValue(of(fullArticle));

    component.submit();

    expect(mockArticlesService.save).toHaveBeenCalledWith(jasmine.objectContaining(articleData));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/article', 'test-title']);
  });

  it('should handle errors on submit', () => {
    const error = { error: { errors: { title: ['is required'] } } };
    mockArticlesService.save.and.returnValue(of(error as any));

    component.submit();

    expect(component.errors).toEqual(jasmine.objectContaining({ title: jasmine.any(Array) }));
    expect(component.isSubmitting).toBeFalse();
  });
});