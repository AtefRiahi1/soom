import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl = `${environment.baseUrl}/commande`;

  constructor(private http: HttpClient) {}

  // Créer une commande
  createCommande(commande: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, commande, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Convertir un devis en commande
  convertirDevisEnCommande(devisId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/${devisId}`, {}, {
      params: { empEmail }
    });
  }

  // Obtenir une commande par ID
  getCommandeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une commande
  updateCommande(id: number, updatedCommande: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedCommande, {
      params: { empEmail }
    });
  }

  // Supprimer une commande
  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les commandes par ID d'entreprise
  getCommandesByEntrepriseId(entrepriseId: number): Observable<any[]> {
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
