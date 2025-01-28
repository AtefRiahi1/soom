import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = `${environment.baseUrl}/facture`;

  constructor(private http: HttpClient) {}

  // Créer une facture
  createFacture(facture: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, facture, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Convertir une livraison en facture
  convertirLivraisonEnFacture(livraisonId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/livraison/${livraisonId}`, {}, {
      params: { empEmail }
    });
  }

  // Convertir une commande en facture
  convertirCommandeEnFacture(commandeId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/commande/${commandeId}`, {}, {
      params: { empEmail }
    });
  }

  // Obtenir une facture par ID
  getFactureById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une facture
  updateFacture(id: number, updatedFacture: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedFacture, {
      params: { empEmail }
    });
  }

  // Supprimer une facture
  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les factures par ID d'entreprise
  getFacturesByEntrepriseId(entrepriseId: number): Observable<any[]> {
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

  // Mettre à jour le statut d'une facture comme payée
  updateFacturePaye(factureId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/paye/${factureId}`, {});
  }
}
