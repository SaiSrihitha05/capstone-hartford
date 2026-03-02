import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from '../../../services/policy-service';
import { PlanService } from '../../../services/plan-service';

@Component({
  selector: 'app-buy-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-policy.html'
})
export class BuyPolicy implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private policyService = inject(PolicyService);
  private planService = inject(PlanService);
  private cdr = inject(ChangeDetectorRef);

  step = 1;
  planId: number = 0;
  selectedPlan: any = null;
  
  // Section 1: Basic Config (Matching PolicyService.cs logic)
  numMembers: number = 1;
  numNominees: number = 1;
  policyData = { 
    startDate: '', 
    premiumFrequency: 'Monthly', // Options: Monthly, Quarterly, Yearly
    termYears: 0 
  };

  members: any[] = [];
  nominees: any[] = [];

  // Files for [FromForm]
  identityProof: File | null = null;
  incomeProof: File | null = null;
  memberDocuments: File[] = [];

  ngOnInit() {
    this.planId = Number(this.route.snapshot.queryParams['planId']);
    if (this.planId) {
      this.planService.getPlanById(this.planId).subscribe(plan => {
        this.selectedPlan = plan;
        this.policyData.termYears = plan.minTermYears;
        this.syncMembers();
        this.syncNominees();
      });
    }
  }

  syncMembers() {
    const current = this.members.length;
    if (this.numMembers > current) {
      for (let i = current; i < this.numMembers; i++) {
        this.members.push({
          MemberName: '', RelationshipToCustomer: i === 0 ? 'Self' : '',
          DateOfBirth: '', Gender: 'Male', CoverageAmount: this.selectedPlan.minCoverageAmount,
          IsSmoker: false, HasPreExistingDiseases: false, DiseaseDescription: '',
          Occupation: '', IsPrimaryInsured: i === 0
        });
      }
    } else { this.members.splice(this.numMembers); }
    this.cdr.detectChanges();
  }

  syncNominees() {
    const current = this.nominees.length;
    if (this.numNominees > current) {
      for (let i = current; i < this.numNominees; i++) {
        this.nominees.push({ NomineeName: '', RelationshipToPolicyHolder: '', ContactNumber: '', SharePercentage: 0 });
      }
    } else { this.nominees.splice(this.numNominees); }
    this.cdr.detectChanges();
  }

  getAge(dob: string): number {
    if (!dob) return 0;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
    return age;
  }

  getTotalNomineeShare(): number {
    return this.nominees.reduce((sum, n) => sum + (n.SharePercentage || 0), 0);
  }

  // Backend Validation: dto.StartDate.Date <= DateTime.Today
  isFutureDate(): boolean {
    if (!this.policyData.startDate) return true;
    return new Date(this.policyData.startDate) > new Date();
  }

  onFileChange(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (type === 'id') this.identityProof = file;
    if (type === 'income') this.incomeProof = file;
    if (type === 'member' && index !== undefined) this.memberDocuments[index] = file;
    this.cdr.detectChanges();
  }

  printProof() { window.print(); }

submit() {
  const fd = new FormData();
  
  // Log the data being sent for manual verification
  console.log("--- Preparing Submission Data ---");
  console.log("Policy Data:", this.policyData);
  console.log("Members Array:", this.members);
  console.log("Nominees Array:", this.nominees);

  fd.append('PlanId', this.planId.toString());
  fd.append('StartDate', this.policyData.startDate);
  fd.append('PremiumFrequency', this.policyData.premiumFrequency);
  fd.append('TermYears', this.policyData.termYears.toString());
  
  // Ensure PascalCase matches PolicyMemberDto and PolicyNomineeDto exactly
  fd.append('Members', JSON.stringify(this.members));
  fd.append('Nominees', JSON.stringify(this.nominees));
  
  if (this.identityProof) fd.append('IdentityProof', this.identityProof);
  if (this.incomeProof) fd.append('IncomeProof', this.incomeProof);
  this.memberDocuments.forEach((f, i) => { 
    if (f) {
      console.log(`Appending Document for Member ${i}`);
      fd.append('MemberDocuments', f); 
    }
  });

  this.policyService.buyPolicy(fd).subscribe({
    next: (res) => {
      console.log('Success Response:', res);
      this.router.navigate(['/customer/my-policies']);
    },
    error: (err) => {
      // This is critical: It prints the specific BadRequestException message from your backend
      console.error('SERVER ERROR (400):', err.error);
      
      // If your backend returns a message property, show it in the alert
      const errorMessage = err.error?.message || err.error || 'Check console for details';
      alert(`Submission Failed: ${errorMessage}`);
    }
  });
}
// Add this to your BuyPolicy class

calculateTotalPremium(): number {
  if (!this.selectedPlan || !this.members.length) return 0;

  let total = 0;
  const frequency = this.policyData.premiumFrequency;
  const term = this.policyData.termYears;

  this.members.forEach(m => {
    // 1. Annual Base Premium: (Coverage / 1000) * BaseRate
    let annualPremium = (m.CoverageAmount / 1000) * this.selectedPlan.baseRate;

    // 2. Age Factor
    const age = this.getAge(m.DateOfBirth);
    let ageFactor = 2.2;
    if (age <= 25) ageFactor = 0.8;
    else if (age <= 35) ageFactor = 1.0;
    else if (age <= 45) ageFactor = 1.3;
    else if (age <= 55) ageFactor = 1.7;

    // 3. Smoker & Gender Factors
    const smokerFactor = m.IsSmoker ? 1.5 : 1.0;
    const genderFactor = m.Gender?.toLowerCase() === 'female' ? 0.9 : 1.0;

    // 4. Term Factor
    let termFactor = 1.3;
    if (term <= 10) termFactor = 1.0;
    else if (term <= 20) termFactor = 1.1;
    else if (term <= 30) termFactor = 1.2;

    // 5. Final Annual Calculation with 18% GST (1.18m)
    const withGst = annualPremium * ageFactor * smokerFactor * genderFactor * termFactor * 1.18;

    // 6. Split by Frequency
    let finalMemberPremium = withGst;
    if (frequency === 'Monthly') finalMemberPremium = withGst / 12;
    else if (frequency === 'Quarterly') finalMemberPremium = withGst / 4;

    total += finalMemberPremium;
  });

  return Math.round(total * 100) / 100; // Round to 2 decimals
}

  nextStep() { this.step++; window.scrollTo(0,0); }
  prevStep() { this.step--; window.scrollTo(0,0); }
}