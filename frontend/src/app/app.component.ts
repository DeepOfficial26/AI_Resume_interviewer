import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>AI Interview Preparation Platform</h1>
        <nav>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/resume">Resume</a>
          <a routerLink="/interview">Interview</a>
          <a routerLink="/auth/login" *ngIf="!isAuthenticated">Login</a>
          <button *ngIf="isAuthenticated" (click)="logout()">Logout</button>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .app-header {
      background: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .app-header nav {
      display: flex;
      gap: 1rem;
    }
    .app-header a {
      color: white;
      text-decoration: none;
    }
    .app-main {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  isAuthenticated = false; // This would come from auth service

  logout() {
    // Implement logout
  }
}
