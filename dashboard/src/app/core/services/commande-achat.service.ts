import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeAchatService {

  private apiUrl = `${environment.baseUrl}/commandeachats`;

  constructor(private http: HttpClient) {}

  // Créer une commande d'achat
  createCommandeAchat(commandeAchat: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, commandeAchat, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Obtenir une commande d'achat par ID
  getCommandeAchatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une commande d'achat
  updateCommandeAchat(id: number, updatedCommandeAchat: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedCommandeAchat, {
      params: { empEmail }
    });
  }

  // Supprimer une commande d'achat
  deleteCommandeAchat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les commandes d'achat par ID d'entreprise
  getCommandesByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  // Télécharger un fichier
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
