import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = `${environment.baseUrl}/articles`;

  constructor(private http: HttpClient) {}

  // Ajouter un article
  addArticle(article: any, entrepriseId: number, empEmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, article, {
      params: { entrepriseId: entrepriseId.toString(), empEmail }
    });
  }

  // Obtenir les articles par ID d'entreprise
  getArticlesByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${entrepriseId}`);
  }

  // Mettre à jour un article
  updateArticle(id: number, updatedArticle: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedArticle);
  }

  // Supprimer un article
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
