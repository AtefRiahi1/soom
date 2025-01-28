import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceptionAchatService {

  private apiUrl = `${environment.baseUrl}/receptionachats`;

  constructor(private http: HttpClient) {}

  // Créer une réception d'achat
  createReceptionAchat(receptionAchat: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, receptionAchat, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Convertir une facture en réception d'achat
  convertirFactureEnReception(factureId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/${factureId}`, {}, {
      params: { empEmail }
    });
  }

  // Obtenir une réception d'achat par ID
  getReceptionAchatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une réception d'achat
  updateReceptionAchat(id: number, updatedReceptionAchat: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedReceptionAchat, {
      params: { empEmail }
    });
  }

  // Supprimer une réception d'achat
  deleteReceptionAchat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les réceptions par ID d'entreprise
  getReceptionsByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  // Télécharger un fichier
  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(`${this.apiUrl}/upload`, formData);
  }

  // Télécharger un fichier par nom
  downloadFile(fileName: string, email: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileName}`, {
      responseType: 'blob',
      params: { email }
    });
  }
}
