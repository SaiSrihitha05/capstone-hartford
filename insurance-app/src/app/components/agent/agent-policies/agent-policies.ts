import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../../services/policy-service';

@Component({
  selector: 'app-agent-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-policies.html'
})
export class AgentPolicies implements OnInit {
  private policyService = inject(PolicyService);
  
  policies: any[] = [];
  loading = true;
  selectedPolicy: any = null; // For viewing deep details like members/documents
  showDetailsModal = false;

  statusOptions = ['Pending', 'Active', 'Expired', 'Cancelled', 'Rejected', 'Matured', 'Closed'];

  ngOnInit() { this.loadMyPolicies(); }

  loadMyPolicies() {
    this.policyService.getAgentPolicies().subscribe(data => {
      this.policies = data;
      this.loading = false;
    });
  }

  onUpdateStatus(policyId: number, event: any) {
    const newStatus = event.target.value;
    // Maps to your UpdatePolicyStatusDto
    const dto = { status: newStatus, remarks: 'Updated by Agent verification' };

    this.policyService.updatePolicyStatus(policyId, dto).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadMyPolicies();
      },
      error: (err) => alert('Status update failed')
    });
  }

  viewPolicyDetails(policy: any) {
    this.selectedPolicy = policy;
    this.showDetailsModal = true;
  }
}