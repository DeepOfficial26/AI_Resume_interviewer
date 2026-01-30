import { Component, OnInit } from '@angular/core';
import { ResumeService, Resume } from '../../../../app/core/services/resume.service';

@Component({
  selector: 'app-resume-list',
  template: `
    <div class="resume-list-container">
      <h2>My Resumes</h2>
      <a routerLink="/resume/upload">Upload New Resume</a>
      <div class="resume-grid">
        <div *ngFor="let resume of resumes" class="resume-card">
          <h3>{{ resume.fileName }}</h3>
          <p>Status: {{ resume.parsingStatus }}</p>
          <p>Type: {{ resume.fileType }}</p>
          <div *ngIf="resume.parsedData">
            <p>Skills: {{ resume.parsedData.skills?.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .resume-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .resume-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
  `]
})
export class ResumeListComponent implements OnInit {
  resumes: Resume[] = [];

  constructor(private resumeService: ResumeService) {}

  ngOnInit() {
    this.resumeService.getResumes().subscribe({
      next: (response: { resumes: Resume[] }) => this.resumes = response.resumes,
      error: (err: unknown) => console.error('Error loading resumes:', err)
    });
  }
}
