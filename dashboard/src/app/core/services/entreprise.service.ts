import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  private apiUrl = `${environment.baseUrl}/entreprise`;

  constructor(private http: HttpClient) {}

  getRecommendedModules(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommended?moduleId=${moduleId}`);
  }

  getAllEntreprises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  updateEntrepriseStatus(entrepriseId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/status/${entrepriseId}`, {});
  }

  updateEntreprisePassword(id: number, newPassword: string): Observable<any> {
    const body = { newPassword };
    return this.http.put(`${this.apiUrl}/${id}/updatePassword`, body);
  }

  getEntrepriseByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${email}`);
  }

  updateEntreprise(id: number, updatedEntreprise: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedEntreprise);
  }
}
