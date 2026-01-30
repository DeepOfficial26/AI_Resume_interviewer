import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InterviewSetupComponent } from './components/interview-setup/interview-setup.component';
import { InterviewSessionComponent } from './components/interview-session/interview-session.component';

@NgModule({
  declarations: [
    InterviewSetupComponent,
    InterviewSessionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'setup', component: InterviewSetupComponent },
      { path: ':id', component: InterviewSessionComponent }
    ])
  ]
})
export class InterviewModule { }
