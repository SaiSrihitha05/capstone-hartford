import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim-service';

@Component({
  selector: 'app-claims-officer-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claims-officer-claims.html'
})
export class ClaimsOfficerClaims implements OnInit {
  private claimService = inject(ClaimService);
  private cdr = inject(ChangeDetectorRef);

  claims: any[] = [];
  loading = true;
  selectedClaim: any = null;
  showProcessModal = false;

  // Only these two are valid for ClaimsOfficer
  statusOptions = ['Settled', 'Rejected'];

  // Process form data
  processForm = {
    status: 'Approved',
    remarks: '',
    settlementAmount: null as number | null
  };

  ngOnInit() {
    this.loadMyClaims();
  }

  loadMyClaims() {
    this.loading = true;
    this.claimService.getMyAssignedClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openProcessModal(claim: any) {
    this.selectedClaim = claim;
    // Reset form
    this.processForm = {
      status: 'Settled',
      remarks: '',
      settlementAmount: null
    };
    this.showProcessModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showProcessModal = false;
    this.selectedClaim = null;
    this.cdr.detectChanges();
  }

submitProcess() {
  if (!this.processForm.remarks.trim()) {
    alert('Remarks are required');
    return;
  }

  // Settlement amount only required when Approved
  if (this.processForm.status === 'Approved' &&
      (!this.processForm.settlementAmount ||
       this.processForm.settlementAmount <= 0)) {
    alert('Settlement amount is required when approving a claim');
    return;
  }

  const dto: any = {
    status: this.processForm.status,
    remarks: this.processForm.remarks
  };

  if (this.processForm.status === 'Approved') {
    dto.settlementAmount = this.processForm.settlementAmount;
  }

  this.claimService.processClaim(this.selectedClaim.id, dto).subscribe({
    next: () => {
      alert(`Claim ${this.processForm.status} successfully!`);
      this.closeModal();
      this.loadMyClaims();
    },
    error: (err) => {
      alert(err.error?.detail || 'Error processing claim');
    }
  });
}

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Submitted':   return 'bg-blue-500';
      case 'UnderReview': return 'bg-amber-500';
      case 'Settled':     return 'bg-green-500';
      case 'Rejected':    return 'bg-red-500';
      default:            return 'bg-gray-500';
    }
  }

  canProcess(claim: any): boolean {
    // Only UnderReview claims can be processed
    return claim.status === 'UnderReview';
  }
}