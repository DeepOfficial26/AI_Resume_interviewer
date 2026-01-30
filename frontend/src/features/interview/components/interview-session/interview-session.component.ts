import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from '../../../../app/core/services/interview.service';
import { SocketService } from '../../../../app/core/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-interview-session',
  template: `
    <div class="session-container">
      <h2>Interview Session</h2>
      <div *ngIf="currentQuestion" class="question-section">
        <h3>Question</h3>
        <p>{{ currentQuestion.questionText }}</p>
        <p><strong>Type:</strong> {{ currentQuestion.questionType }}</p>
        <p><strong>Category:</strong> {{ currentQuestion.category }}</p>
      </div>
      <div class="answer-section">
        <textarea 
          [(ngModel)]="answerText" 
          placeholder="Type your answer here..."
          rows="10"
        ></textarea>
        <button (click)="submitAnswer()" [disabled]="!answerText || submitting">
          {{ submitting ? 'Submitting...' : 'Submit Answer' }}
        </button>
      </div>
      <div *ngIf="lastEvaluation" class="evaluation-section">
        <h3>Evaluation</h3>
        <p><strong>Score:</strong> {{ lastEvaluation.score }}/10</p>
        <div *ngIf="lastEvaluation.strengths">
          <h4>Strengths:</h4>
          <ul>
            <li *ngFor="let strength of lastEvaluation.strengths">{{ strength }}</li>
          </ul>
        </div>
        <div *ngIf="lastEvaluation.improvements">
          <h4>Improvements:</h4>
          <ul>
            <li *ngFor="let improvement of lastEvaluation.improvements">{{ improvement }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .question-section, .answer-section, .evaluation-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: #2c3e50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
  `]
})
export class InterviewSessionComponent implements OnInit, OnDestroy {
  interviewId: string = '';
  currentQuestion: any = null;
  answerText: string = '';
  submitting = false;
  lastEvaluation: any = null;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.interviewId = this.route.snapshot.params['id'];
    this.socketService.connect();
    
    // Start interview
    this.interviewService.startInterview(this.interviewId).subscribe({
      next: () => this.requestQuestion(),
      error: (err: unknown) => console.error('Error starting interview:', err)
    });

    // Listen for questions
    this.subscriptions.add(
      this.socketService.onQuestionReceived().subscribe((data: { question: unknown }) => {
        this.currentQuestion = data.question;
        this.answerText = '';
      })
    );

    // Listen for evaluations
    this.subscriptions.add(
      this.socketService.onAnswerEvaluated().subscribe((data: { answer: { evaluation: unknown }; needsFollowUp: boolean }) => {
        this.lastEvaluation = data.answer.evaluation;
        this.submitting = false;
        if (data.needsFollowUp) {
          // Follow-up question will come via socket
        } else {
          // Request next question after a delay
          setTimeout(() => this.requestQuestion(), 2000);
        }
      })
    );

    // Listen for follow-up questions
    this.subscriptions.add(
      this.socketService.onFollowUpQuestion().subscribe((data: { question: unknown }) => {
        this.currentQuestion = data.question;
        this.answerText = '';
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.socketService.disconnect();
  }

  requestQuestion() {
    this.socketService.requestQuestion(this.interviewId);
  }

  submitAnswer() {
    if (!this.answerText || !this.currentQuestion) return;
    
    this.submitting = true;
    this.socketService.submitAnswer(
      this.interviewId,
      this.currentQuestion.questionId,
      this.answerText
    );
  }
}
