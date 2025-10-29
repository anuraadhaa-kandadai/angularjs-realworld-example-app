import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './user.service';
import { User, Credentials } from '../models/user.model';
import { environment } from '@env/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('attemptAuth', () => {
    it('should send POST request for login', () => {
      const credentials: Credentials = { email: 'test@example.com', password: 'password' };
      const mockUser: User = { email: 'test@example.com', token: 'token', username: 'testuser', bio: '', image: '' };

      service.attemptAuth('login', credentials).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.api_url}/users/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ user: credentials });
      req.flush({ user: mockUser });
    });

    it('should send POST request for register', () => {
      const credentials: Credentials = { email: 'test@example.com', password: 'password' };
      const mockUser: User = { email: 'test@example.com', token: 'token', username: 'testuser', bio: '', image: '' };

      service.attemptAuth('register', credentials).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.api_url}/users`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ user: credentials });
      req.flush({ user: mockUser });
    });
  });

  // Add more tests for other methods (update, logout, verifyAuth, ensureAuthIs) here
});