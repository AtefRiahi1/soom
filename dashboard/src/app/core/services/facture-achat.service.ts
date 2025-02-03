import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactureAchatService {

  private apiUrl = `${environment.baseUrl}/factureachats`;

  constructor(private http: HttpClient) {}

  // Créer une facture d'achat
  createFactureAchat(factureAchat: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, factureAchat, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Convertir une commande en facture d'achat
  convertirCommandeEnFacture(commandeId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/${commandeId}`, {}, {
      params: { empEmail }
    });
  }

  // Obtenir une facture d'achat par ID
  getFactureAchatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une facture d'achat
  updateFactureAchat(id: number, updatedFactureAchat: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedFactureAchat, {
      params: { empEmail }
    });
  }

  // Supprimer une facture d'achat
  deleteFactureAchat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les factures d'achat par ID d'entreprise
  getFacturesByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  uploadFile(file: File,name:string):Observable<HttpEvent<string>> {
  
      const formData = new FormData();
      formData.append('file', file,name);
  
      return this.http.post<string>(`${this.apiUrl}/upload`, formData,{
        reportProgress:true,
        observe:'events'
      });
    }
  
    // Télécharger un fichier par nom
    downloadFile(fileName: string, email: string):Observable<HttpEvent<Blob>> {
      return this.http.get(`${this.apiUrl}/download/${fileName}`, {
        responseType: 'blob',
        reportProgress:true,
        observe:'events',
        params: { email }
      });
    }

  // Mettre à jour le statut d'une facture comme payée
  updateFacturePaye(factureId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/paye/${factureId}`, {});
  }
}
