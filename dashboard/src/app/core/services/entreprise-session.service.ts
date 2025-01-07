import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseSessionService {

  private apiUrl = `${environment.baseUrl}/entsessions`;

  constructor(private http: HttpClient) {}

  startSession(entMail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, null, {
      params: { entMail },
    });
  }

  endSession(sessionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/end`, null, {
      params: { sessionId: sessionId.toString() },
    });
  }

  createEntrepriseSession(entrepriseSession: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, entrepriseSession);
  }

  isSessionActive(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/active`);
  }
}
