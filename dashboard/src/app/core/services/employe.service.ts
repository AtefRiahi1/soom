import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private apiUrl = `${environment.baseUrl}/employe`;

  constructor(private http: HttpClient) {}

  // Ajouter un employé
  addEmploye(employe: any, entrepriseId: number, moduleIds: number[]): Observable<any> {
    const params = new HttpParams()
      .set('entrepriseId', entrepriseId)
      .set('moduleIds', moduleIds.join(','));
    return this.http.post(`${this.apiUrl}`, employe, { params });
  }

  getEmployesByEntrepriseId(entrepriseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  updateEmployeStatus(employeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/status/${employeId}`, {});
  }

  updateEmployeVerif(employeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/verif/${employeId}`, {});
  }

  manageEmployeData(
    employeId: number,
    updateEmploye: any,
    addModuleIds: number[],
    removeModuleIds: number[]
  ): Observable<any> {
    const params = new HttpParams()
      .set('addModuleIds', addModuleIds.join(','))
      .set('removeModuleIds', removeModuleIds.join(','));
    return this.http.put(`${this.apiUrl}/${employeId}`, updateEmploye, { params });
  }

  updateEmployePassword(id: number, newPassword: string): Observable<any> {
    const body = { newPassword };
    return this.http.put(`${this.apiUrl}/${id}/updatePassword`, body);
  }
}
