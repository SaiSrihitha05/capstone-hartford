import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../services/policy-service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-policies.html'
})
export class MyPolicies implements OnInit {
  private policyService = inject(PolicyService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  policies: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.policyService.getMyPolicies().subscribe({
      next: (data) => {
        this.policies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching policies', err);
        this.loading = false;
      }
    });
  }

  // Logic to determine if a premium is due or in grace period
  getPremiumStatus(policy: any) {
    if (policy.status !== 'Active') return null;

    const today = new Date();
    const dueDate = new Date(policy.nextDueDate);
    const graceEndDate = new Date(dueDate);
    
    // Defaulting to 30 days if gracePeriodDays isn't in the response, 
    // though ideally it comes from the Plan object inside the policy
    const graceDays = policy.gracePeriodDays || 30; 
    graceEndDate.setDate(dueDate.getDate() + graceDays);

    if (today >= dueDate && today <= graceEndDate) {
      return { label: 'In Grace Period', class: 'text-orange-600 bg-orange-50 border-orange-100' };
    } else if (today > graceEndDate) {
      return { label: 'Payment Overdue', class: 'text-red-600 bg-red-50 border-red-100' };
    } else if (this.isNear(dueDate, 7)) {
      return { label: 'Due Soon', class: 'text-blue-600 bg-blue-50 border-blue-100' };
    }
    return null;
  }

  // Add these helper methods to your existing MyPolicies class

// 1. Check if the payment button should be visible
canPayPremium(policy: any): boolean {
  if (policy.status !== 'Active') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(policy.nextDueDate);
  
  // Show button if today is the due date or if we are past the due date (Grace Period)
  return today >= dueDate;
}

// 2. Handle the Details click
viewPolicyDetails(policyId: number) {
  // Navigates to the route we defined: /customer-dashboard/policy-details/123
  this.router.navigate(['/customer-dashboard/policy-details', policyId]);
}

// 3. Handle the Pay Now click
processPayment(policy: any) {
  // Navigate to a payment gateway or premium payment page
  this.router.navigate(['/customer-dashboard/pay-premium'], { 
    queryParams: { policyId: policy.id, amount: policy.totalPremiumAmount } 
  });
}

  private isNear(date: Date, days: number): boolean {
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    return diff > 0 && diff < (days * 24 * 60 * 60 * 1000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-500 text-white';
      case 'Pending': return 'bg-amber-400 text-white';
      case 'Lapsed': return 'bg-gray-400 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  }
}