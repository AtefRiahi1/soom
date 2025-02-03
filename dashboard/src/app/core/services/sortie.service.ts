import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SortieService {

  private apiUrl = `${environment.baseUrl}/sortie`;

  constructor(private http: HttpClient) {}

  // Créer une sortie
  createSortie(sortie: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, sortie, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Convertir une facture en sortie
  convertirFactureEnSortie(factureId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convertir/${factureId}`, {}, {
      params: { empEmail }
    });
  }

  // Obtenir une sortie par ID
  getSortieById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une sortie
  updateSortie(id: number, updatedSortie: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedSortie, {
      params: { empEmail }
    });
  }

  // Supprimer une sortie
  deleteSortie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les sorties par ID d'entreprise
  getSortiesByEntrepriseId(entrepriseId: number): Observable<any[]> {
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
