import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private router=inject(Router);
  stats: any = null;
  loading = true;

  ngOnInit() {
    this.fetchAgentStats();
  }

// agent-dashboard.ts
fetchAgentStats() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found, redirecting to login');
    this.router.navigate(['/login']);
    return;
  }

  this.http.get('https://localhost:7027/api/Dashboard/agent').subscribe({
    next: (data) => {
      this.stats = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Frontend Error Block Triggered:', err);
      // If Network tab is 200 but you are here, 'err' will tell us why
      this.loading = false;
    }
  });
}
}