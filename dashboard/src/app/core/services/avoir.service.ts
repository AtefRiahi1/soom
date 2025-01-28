import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvoirService {

  private apiUrl = `${environment.baseUrl}/avoirs`;

  constructor(private http: HttpClient) {}

  // Créer un avoir en argent pour une facture
  creerAvoirEnArgentFacture(facture: any, montantEcart: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/argent/facture`, facture, {
      params: { montantEcart: montantEcart.toString() }
    });
  }

  // Créer un avoir en argent pour une facture d'achat
  creerAvoirEnArgentFactureAchat(factureAchat: any, montantEcart: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/argent/factureAchat`, factureAchat, {
      params: { montantEcart: montantEcart.toString() }
    });
  }

  // Créer un avoir en quantité pour une réception d'achat
  creerAvoirEnQuantiteReceptionAchat(receptionAchat: any, produit: string, quantiteEcart: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quantite/receptionAchat`, receptionAchat, {
      params: { produit, quantiteEcart: quantiteEcart.toString() }
    });
  }

  // Créer un avoir en quantité pour une sortie
  creerAvoirEnQuantiteSortie(sortie: any, produit: string, quantiteEcart: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quantite/sortie`, sortie, {
      params: { produit, quantiteEcart: quantiteEcart.toString() }
    });
  }

  // Obtenir les avoirs par ID d'entreprise
  getAvoirByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }
}
