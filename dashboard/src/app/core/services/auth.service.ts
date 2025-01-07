import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.baseUrl}/auth`;

  constructor(private http: HttpClient) {}

  signUp(entreprise: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, entreprise);
  }

  signIn(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials);
  }

  uploadFile(file: File):Observable<HttpEvent<string>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress:true,
      observe:'events',
      responseType: 'text' 
    });
  }

  downloadFile(fileName: string, email: string):Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiUrl}/download/${fileName}`, {
      params: { email },
      reportProgress:true,
      observe:'events',
      responseType: 'blob' 
    });
  }
}
