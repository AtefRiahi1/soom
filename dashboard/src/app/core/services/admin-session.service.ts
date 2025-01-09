import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminSessionService {

  private apiUrl = `${environment.baseUrl}/adminsessions`;

  constructor(private http: HttpClient) {}

  startSession(adminMail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, null, {
      params: { adminMail },
    });
  }

  endSession(sessionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/end`, null, {
      params: { sessionId: sessionId.toString() },
    });
  }

  createAdminSession(adminSession: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, adminSession);
  }

  isSessionActive(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/active`);
  }

  getAdminByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${email}`);
  }
}
