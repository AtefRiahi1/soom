import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  private apiUrl = `${environment.baseUrl}/livraison`;

  constructor(private http: HttpClient) {}

  // Créer une livraison
  createLivraison(livraison: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, livraison, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Convertir une commande en livraison
  convertirCommandeEnLivraison(commandeId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/${commandeId}`, {}, {
      params: { empEmail }
    });
  }

  // Obtenir une livraison par ID
  getLivraisonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une livraison
  updateLivraison(id: number, updatedLivraison: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedLivraison, {
      params: { empEmail }
    });
  }

  // Supprimer une livraison
  deleteLivraison(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les livraisons par ID d'entreprise
  getLivraisonsByEntrepriseId(entrepriseId: number): Observable<any[]> {
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
}
