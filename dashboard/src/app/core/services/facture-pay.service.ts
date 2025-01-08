import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturePayService {

  private apiUrl = `${environment.baseUrl}/facturepay`;

  constructor(private http: HttpClient) {}

  creerFacture(employeId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${employeId}`, {});
  }
}
