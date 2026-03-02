import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../../services/plan-service';

@Component({
  selector: 'app-admin-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-plans.html'
})
export class AdminPlans implements OnInit {
  private planService = inject(PlanService);
  
  plans: any[] = [];
  showModal = false;
  isEditMode = false;

  // Form Object
// Initial state for a new plan
currentPlan: any = {
  planName: '',
  planType: '',
  description: '',
  baseRate: 0.01,
  minAge: 18,
  maxAge: 70,
  minCoverageAmount: 100000,
  maxCoverageAmount: 10000000,
  minTermYears: 5,
  maxTermYears: 30,
  gracePeriodDays: 30,
  hasMaturityBenefit: false,
  isReturnOfPremium: false,
  maxPolicyMembersAllowed: 1,
  commissionRate: 10,
  isActive: true
};

  ngOnInit() { this.loadPlans(); }

  loadPlans() {
    this.planService.getPlans().subscribe(data => this.plans = data);
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentPlan = { id: 0, planName: '', planType: '', minAge: 18, isActive: true };
    this.showModal = true;
  }

  openEditModal(plan: any) {
    this.isEditMode = true;
    this.currentPlan = { ...plan }; // Create a copy
    this.showModal = true;
  }

  savePlan() {
    if (this.isEditMode) {
      this.planService.updatePlan(this.currentPlan.id, this.currentPlan).subscribe(() => {
        this.loadPlans();
        this.showModal = false;
      });
    } else {
      this.planService.createPlan(this.currentPlan).subscribe(() => {
        this.loadPlans();
        this.showModal = false;
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Delete this plan permanently?')) {
      this.planService.deletePlan(id).subscribe(() => this.loadPlans());
    }
  }
}