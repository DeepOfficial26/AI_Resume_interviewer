import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Interview {
  _id: string;
  userId: string;
  resumeId: string;
  role: 'L3' | 'L4';
  focusAreas: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'abandoned';
  currentDifficulty: string;
  questions: any[];
  overallScore?: number;
  skillBreakdown?: any;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionType: 'theory' | 'coding' | 'system-design' | 'scenario';
  category: string;
  difficulty: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = `${environment.apiUrl}/api/interview`;

  constructor(private http: HttpClient) {}

  createInterview(resumeId: string, role: 'L3' | 'L4', focusAreas: string[]): Observable<{ interview: Interview }> {
    return this.http.post<{ interview: Interview }>(this.apiUrl, { resumeId, role, focusAreas });
  }

  startInterview(interviewId: string): Observable<{ interview: Interview }> {
    return this.http.post<{ interview: Interview }>(`${this.apiUrl}/${interviewId}/start`, {});
  }

  generateQuestion(interviewId: string): Observable<{ question: Question }> {
    return this.http.post<{ question: Question }>(`${this.apiUrl}/${interviewId}/question`, {});
  }

  submitAnswer(interviewId: string, questionId: string, answerText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${interviewId}/answer`, { questionId, answerText });
  }

  completeInterview(interviewId: string): Observable<{ interview: Interview }> {
    return this.http.post<{ interview: Interview }>(`${this.apiUrl}/${interviewId}/complete`, {});
  }

  getInterview(interviewId: string): Observable<{ interview: Interview }> {
    return this.http.get<{ interview: Interview }>(`${this.apiUrl}/${interviewId}`);
  }

  getUserInterviews(): Observable<{ interviews: Interview[] }> {
    return this.http.get<{ interviews: Interview[] }>(this.apiUrl);
  }
}
