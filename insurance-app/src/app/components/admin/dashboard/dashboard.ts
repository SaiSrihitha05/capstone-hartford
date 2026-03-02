import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  
  // Data property to hold the backend response
  stats: any = null;
  loading: boolean = true;

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.http.get('https://localhost:7027/api/Dashboard/admin').subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
        this.loading = false;
      }
    });
  }
}