import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../app/core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" required>
          </div>
          <button type="submit" [disabled]="loginForm.invalid">Login</button>
          <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #2c3e50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: unknown) => console.error('Login error:', err)
      });
    }
  }
}
