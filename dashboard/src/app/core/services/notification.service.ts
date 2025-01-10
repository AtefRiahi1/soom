import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = `${environment.baseUrl}/notifications`;

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getNotificationsByAdminId(adminId: number): Observable<any[]> {
    const url = `${this.apiUrl}/admin/${adminId}`;
    return this.http.get<any[]>(url);
  }

  getNotificationsByEntrepriseId(entId: number): Observable<any[]> {
    const url = `${this.apiUrl}/entreprise/${entId}`;
    return this.http.get<any[]>(url);
  }

  getNotificationsByEmployeId(empId: number): Observable<any[]> {
    const url = `${this.apiUrl}/employe/${empId}`;
    return this.http.get<any[]>(url);
  }

  deleteNotification(notificationId: number): Observable<void> {
    const url = `${this.apiUrl}/${notificationId}`;
    return this.http.delete<void>(url);
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    const url = `${this.apiUrl}/${notificationId}/read`;
    return this.http.put<any>(url, {});
  }

  getNotificationById(notificationId: number): Observable<any> {
    const url = `${this.apiUrl}/${notificationId}`;
    return this.http.get<any>(url);
  }
}
