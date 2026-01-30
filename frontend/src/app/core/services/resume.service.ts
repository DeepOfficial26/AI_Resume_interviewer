import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Resume {
  _id: string;
  fileName: string;
  filePath: string;
  fileType: 'pdf' | 'docx';
  parsedData: any;
  parsingStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/api/resume`;

  constructor(private http: HttpClient) {}

  uploadResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getResumes(): Observable<{ resumes: Resume[] }> {
    return this.http.get<{ resumes: Resume[] }>(this.apiUrl);
  }

  getResume(id: string): Observable<{ resume: Resume }> {
    return this.http.get<{ resume: Resume }>(`${this.apiUrl}/${id}`);
  }
}
