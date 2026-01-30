import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  constructor(private authService: AuthService) {}

  connect(): void {
    const token = this.authService.getToken();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
      console.error('Not authenticated');
      return;
    }

    this.socket = io(environment.apiUrl, {
      auth: {
        token,
        userId: user.id
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  startInterview(interviewId: string): void {
    if (this.socket) {
      this.socket.emit('start-interview', { interviewId });
    }
  }

  requestQuestion(interviewId: string): void {
    if (this.socket) {
      this.socket.emit('request-question', { interviewId });
    }
  }

  submitAnswer(interviewId: string, questionId: string, answerText: string): void {
    if (this.socket) {
      this.socket.emit('submit-answer', { interviewId, questionId, answerText });
    }
  }

  onInterviewStarted(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('interview-started', (data) => observer.next(data));
      }
    });
  }

  onQuestionReceived(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('question-received', (data) => observer.next(data));
      }
    });
  }

  onAnswerEvaluated(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('answer-evaluated', (data) => observer.next(data));
      }
    });
  }

  onFollowUpQuestion(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('follow-up-question', (data) => observer.next(data));
      }
    });
  }

  onError(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('error', (data) => observer.next(data));
      }
    });
  }
}
