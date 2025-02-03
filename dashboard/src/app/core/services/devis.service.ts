import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  private apiUrl = `${environment.baseUrl}/devis`;

  constructor(private http: HttpClient) {}

  // Créer un devis
  createDevis(devis: any, entrepriseId: number, fournisseurId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, devis, {
      params: { entrepriseId: entrepriseId.toString(), fournisseurId: fournisseurId.toString(), empEmail }
    });
  }

  // Obtenir un devis par ID
  getDevisById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un devis
  updateDevis(id: number, updatedDevis: any, empEmail: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedDevis, {
      params: { empEmail }
    });
  }

  // Supprimer un devis
  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les devis par ID d'entreprise
  getDevisByEntrepriseId(entrepriseId: number): Observable<any[]> {
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
