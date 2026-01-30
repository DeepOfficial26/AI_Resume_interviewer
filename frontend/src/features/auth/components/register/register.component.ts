import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../app/core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Name</label>
            <input type="text" formControlName="name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" required>
          </div>
          <button type="submit" [disabled]="registerForm.invalid">Register</button>
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
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
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.name
      ).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: unknown) => console.error('Registration error:', err)
      });
    }
  }
}
