import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PolicyService } from '../../../services/policy-service';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-details.html'
})
export class PolicyDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private policyService = inject(PolicyService);
  
  policy: any = null;
  loading = true;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.policyService.getPolicyById(id).subscribe({
      next: (data) => {
        this.policy = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

downloadDocument(docId: number, fileName: string) {
  this.policyService.downloadFile(docId).subscribe(blob => {
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  });
}
}