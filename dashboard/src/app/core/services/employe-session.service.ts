import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeSessionService {

  private apiUrl = `${environment.baseUrl}/empsessions`;

  constructor(private http: HttpClient) {}

  startSession(empMail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, null, {
      params: { empMail },
    });
  }

  endSession(sessionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/end`, null, {
      params: { sessionId: sessionId.toString() },
    });
  }

  getAllEmployeSessions(entrId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      params: { entrId: entrId.toString() },
    });
  }

  createEmployeSession(employeSession: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, employeSession);
  }

  isSessionActive(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/active`);
  }
}
