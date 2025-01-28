import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {

  private apiUrl = `${environment.baseUrl}/mouvements`;

  constructor(private http: HttpClient) {}

  // Créer un mouvement
  createMovement(mouvement: any, entrepriseId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, mouvement, {
      params: { entrepriseId: entrepriseId.toString(), empEmail }
    });
  }

  // Obtenir les mouvements par ID d'entreprise
  getMouvementsByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }
}
