import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../services/policy-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-policies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-policies.html'
})
export class AdminPolicies implements OnInit {
  private policyService = inject(PolicyService);
  private http = inject(HttpClient);

  policies: any[] = [];
  agents: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Parallel load policies and agent list
    this.policyService.getAllPolicies().subscribe(data => {
      this.policies = data;
      this.loading = false;
    });

    this.http.get<any[]>('https://localhost:7027/api/Users/agents').subscribe(data => {
      this.agents = data;
    });
  }

  onAssignAgent(policyId: number, event: any) {
    const agentId = event.target.value;
    if (agentId) {
      this.policyService.assignAgent(policyId, +agentId).subscribe({
        next: () => {
          alert('Agent assigned successfully!');
          this.loadData(); // Refresh list
        }
      });
    }
  }
}