import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  private apiUrl = `${environment.baseUrl}/fournisseurs`;

  constructor(private http: HttpClient) {}

  // Ajouter un fournisseur
  addFournisseur(fournisseur: any, entrepriseId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, fournisseur, {
      params: { entrepriseId: entrepriseId.toString(), empEmail }
    });
  }

  // Obtenir les fournisseurs par ID d'entreprise
  getFournisseursByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  // Mettre à jour un fournisseur
  updateFournisseur(id: number, updatedFournisseur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedFournisseur);
  }

  // Supprimer un fournisseur
  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFournisseurById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
