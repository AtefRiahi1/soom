import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleEmployeService {

  private apiUrl = `${environment.baseUrl}/permission`;

  constructor(private http: HttpClient) {}

  getModuleEmpByEmpId(empId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employe/${empId}`);
  }

  updateModuleEmployePermissions(
    id: number,
    consulter: boolean,
    modifier: boolean,
    ajouter: boolean,
    supprimer: boolean
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      null,
      {
        params: {
          consulter: consulter.toString(),
          modifier: modifier.toString(),
          ajouter: ajouter.toString(),
          supprimer: supprimer.toString(),
        },
      }
    );
  }

  updateModuleEmployePaye(moduleEmployeId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/payment/${moduleEmployeId}`, null);
  }

  getModuleByEntrepriseId(entrId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      params: {
        entrId: entrId.toString(),
      },
    });
  }

  updateModuleEmployeResponsable(
    moduleEmployeId: number,
    empId: number
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/responsable/${moduleEmployeId}/${empId}`, null);
  }
}
