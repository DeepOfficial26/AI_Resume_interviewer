import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResumeUploadComponent } from './components/resume-upload/resume-upload.component';
import { ResumeListComponent } from './components/resume-list/resume-list.component';

@NgModule({
  declarations: [
    ResumeUploadComponent,
    ResumeListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ResumeListComponent },
      { path: 'upload', component: ResumeUploadComponent }
    ])
  ]
})
export class ResumeModule { }
