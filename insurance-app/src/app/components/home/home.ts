import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html'
})
export class Home {
  // Simple properties instead of signals
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;

  whyUsCards = [
    { title: 'Trusted Protection', description: 'Over 200 years of experience protecting what matters most.' },
    { title: 'Fast Claims', description: 'Our streamlined process ensures you get your settlement quickly.' },
    { title: 'Affordable Plans', description: 'Flexible premium options designed to fit every budget.' },
    { title: '24/7 Support', description: 'Round the clock customer support to assist you anytime.' },
    { title: 'Transparent Policies', description: 'Clear policy documents with no hidden terms or conditions.' },
    { title: 'Family Coverage', description: 'Comprehensive plans that cover your entire family.' }
  ];

  stats = [
    { value: '200+', label: 'Years of Trust' },
    { value: '1M+', label: 'Happy Customers' },
    { value: '50+', label: 'Plan Options' },
    { value: '99%', label: 'Claims Settled' }
  ];

  onSubmit() {
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
      // Reset fields
      this.name = '';
      this.email = '';
      this.phone = '';
      this.message = '';
    }, 1500);
  }
}