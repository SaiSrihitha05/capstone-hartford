import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7027/api/Notifications';

  // Get all notifications for the logged-in user
  getMyNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Mark a single notification as read
  markAsRead(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/read`, {});
  }

  // Mark all notifications as read at once
  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.baseUrl}/read-all`, {});
  }
}