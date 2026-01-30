import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from '../../../../app/core/services/resume.service';

@Component({
  selector: 'app-resume-upload',
  template: `
    <div class="upload-container">
      <h2>Upload Resume</h2>
      <div class="upload-area" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
        <input type="file" #fileInput (change)="onFileSelected($event)" accept=".pdf,.docx" hidden>
        <p>Drag and drop your resume here or</p>
        <button (click)="fileInput.click()">Browse Files</button>
        <p *ngIf="selectedFile">Selected: {{ selectedFile.name }}</p>
      </div>
      <button *ngIf="selectedFile" (click)="upload()" [disabled]="uploading">
        {{ uploading ? 'Uploading...' : 'Upload Resume' }}
      </button>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .upload-area {
      border: 2px dashed #ddd;
      padding: 3rem;
      text-align: center;
      border-radius: 8px;
      margin: 2rem 0;
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
export class ResumeUploadComponent {
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  upload() {
    if (!this.selectedFile) return;
    
    this.uploading = true;
    this.resumeService.uploadResume(this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        this.router.navigate(['/resume']);
      },
      error: (err: unknown) => {
        console.error('Upload error:', err);
        this.uploading = false;
      }
    });
  }
}
