import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = `${environment.baseUrl}/clients`;

  constructor(private http: HttpClient) {}

  // Ajouter un client
  addClient(client: any, entrepriseId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, client, {
      params: { entrepriseId: entrepriseId.toString(), empEmail }
    });
  }

  // Obtenir les clients par ID d'entreprise
  getClientsByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  // Mettre à jour un client
  updateClient(id: number, updatedClient: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedClient);
  }

  // Supprimer un client
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
