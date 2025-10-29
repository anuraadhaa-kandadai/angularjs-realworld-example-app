import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ListErrorsComponent } from '../../shared/list-errors.component';

interface AuthForm {
  email: string;
  password: string;
  username?: string;
}

interface RegisterForm extends AuthForm {
  username: string;
}

function isRegisterForm(form: AuthForm): form is RegisterForm {
  return form.username !== undefined;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ListErrorsComponent]
})
export class AuthComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  authType = signal<'login' | 'register'>('login');
  title = signal<string>('Sign in');
  errors = signal<string[]>([]);
  isSubmitting = signal<boolean>(false);
  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.authType.set(this.router.url.includes('login') ? 'login' : 'register');
    this.title.set(this.authType() === 'login' ? 'Sign in' : 'Sign up');
    if (this.authType() === 'register') {
      this.authForm.addControl('username', this.fb.control('', Validators.required));
    }
  }

  submitForm() {
    if (this.authForm.valid) {
      this.isSubmitting.set(true);
      this.errors.set([]);

      const credentials = this.authForm.value as AuthForm;
      
      if (this.authType() === 'login') {
        this.userService.login(credentials).subscribe(this.handleAuthResponse);
      } else {
        if (isRegisterForm(credentials)) {
          this.userService.register(credentials).subscribe(this.handleAuthResponse);
        } else {
          this.errors.set(['Username is required for registration']);
          this.isSubmitting.set(false);
        }
      }
    } else {
      this.errors.set(['Please fill out all required fields correctly']);
    }
  }

  private handleAuthResponse = {
    next: () => {
      console.log('Authentication successful, attempting to navigate to home');
      this.router.navigateByUrl('/home').then(
        () => console.log('Navigation successful'),
        (err) => console.error('Navigation failed', err)
      );
    },
    error: (err: any) => {
      console.error('Authentication error:', err);
      if (err.error && err.error.errors) {
        this.errors.set(Object.keys(err.error.errors).map(key => `${key} ${err.error.errors[key]}`));
      } else {
        this.errors.set(['An unexpected error occurred']);
      }
      this.isSubmitting.set(false);
    }
  };
}