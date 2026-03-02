import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
email = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

onLogin() {
  const credentials = { email: this.email, password: this.password };
  
  this.authService.login(credentials).subscribe({
    next: (response) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('email', response.email);
      localStorage.setItem('role', response.role);

      // Redirect based on the role
      if (response.role === 'Admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (response.role === 'Agent') {
        this.router.navigate(['/agent-dashboard']);
      } else if(response.role === 'ClaimsOfficer'){
        this.router.navigate(['/claims-officer-dashboard']);
      }else {
        this.router.navigate(['/customer-dashboard']); 
      }
    },
    error: (err) => {
      this.errorMessage = 'Invalid email or password';
    }
  });
}
}
