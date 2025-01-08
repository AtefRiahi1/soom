import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private apiUrl = `${environment.baseUrl}/module`;

  constructor(private http: HttpClient) {}

  addModule(module: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, module);
  }

  getAllModules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getModuleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateModule(id: number, module: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, module);
  }

  deleteModule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
