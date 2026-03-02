import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-claims-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  
  stats: any = null;
  loading = true;

  ngOnInit() {
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    this.http.get('https://localhost:7027/api/Dashboard/claims-officer').subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
        this.loading = false;
      }
    });
  }
}