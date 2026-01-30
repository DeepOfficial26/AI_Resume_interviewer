import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InterviewService } from '../../../../app/core/services/interview.service';
import { ResumeService } from '../../../../app/core/services/resume.service';

@Component({
  selector: 'app-interview-setup',
  template: `
    <div class="setup-container">
      <h2>Setup Interview</h2>
      <form [formGroup]="setupForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Select Resume</label>
          <select formControlName="resumeId" required>
            <option value="">-- Select Resume --</option>
            <option *ngFor="let resume of resumes" [value]="resume._id">
              {{ resume.fileName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Role Level</label>
          <select formControlName="role" required>
            <option value="L3">L3 - Mid-level</option>
            <option value="L4">L4 - Senior</option>
          </select>
        </div>
        <div class="form-group">
          <label>Focus Areas</label>
          <div *ngFor="let area of focusAreas" class="checkbox-group">
            <input type="checkbox" [value]="area" (change)="toggleFocusArea(area)">
            <label>{{ area }}</label>
          </div>
        </div>
        <button type="submit" [disabled]="setupForm.invalid || selectedFocusAreas.length === 0">
          Start Interview
        </button>
      </form>
    </div>
  `,
  styles: [`
    .setup-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .checkbox-group {
      margin: 0.5rem 0;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: #2c3e50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class InterviewSetupComponent implements OnInit {
  setupForm: FormGroup;
  resumes: any[] = [];
  focusAreas = [
    'JavaScript',
    'Node.js internals',
    'System Design',
    'Databases',
    'APIs & Security',
    'Debugging & Performance'
  ];
  selectedFocusAreas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private resumeService: ResumeService,
    private router: Router
  ) {
    this.setupForm = this.fb.group({
      resumeId: ['', Validators.required],
      role: ['L3', Validators.required]
    });
  }

  ngOnInit() {
    this.resumeService.getResumes().subscribe({
      next: (response: { resumes: unknown[] }) => this.resumes = response.resumes,
      error: (err: unknown) => console.error('Error loading resumes:', err)
    });
  }

  toggleFocusArea(area: string) {
    const index = this.selectedFocusAreas.indexOf(area);
    if (index > -1) {
      this.selectedFocusAreas.splice(index, 1);
    } else {
      this.selectedFocusAreas.push(area);
    }
  }

  onSubmit() {
    if (this.setupForm.valid && this.selectedFocusAreas.length > 0) {
      this.interviewService.createInterview(
        this.setupForm.value.resumeId,
        this.setupForm.value.role,
        this.selectedFocusAreas
      ).subscribe({
        next: (response: { interview: { _id: string } }) => {
          this.router.navigate(['/interview', response.interview._id]);
        },
        error: (err: unknown) => console.error('Error creating interview:', err)
      });
    }
  }
}
