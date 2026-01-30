import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../../app/core/services/interview.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      <div class="actions">
        <a routerLink="/resume/upload" class="action-card">
          <h3>Upload Resume</h3>
          <p>Upload and parse your resume</p>
        </a>
        <a routerLink="/interview/setup" class="action-card">
          <h3>Start Interview</h3>
          <p>Begin a new interview session</p>
        </a>
      </div>
      <div class="interviews-section">
        <h3>Recent Interviews</h3>
        <div *ngFor="let interview of interviews" class="interview-card">
          <h4>{{ interview.role }} Interview</h4>
          <p>Status: {{ interview.status }}</p>
          <p *ngIf="interview.overallScore">Score: {{ interview.overallScore }}/10</p>
          <button (click)="viewInterview(interview._id)">View</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .interview-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  interviews: any[] = [];

  constructor(
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.interviewService.getUserInterviews().subscribe({
      next: (response: { interviews: unknown[] }) => this.interviews = response.interviews,
      error: (err: unknown) => console.error('Error loading interviews:', err)
    });
  }

  viewInterview(id: string) {
    this.router.navigate(['/interview', id]);
  }
}
