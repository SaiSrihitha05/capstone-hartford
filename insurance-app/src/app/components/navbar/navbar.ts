import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar implements OnInit {
  isScrolled: boolean = false;
  isMobileMenuOpen: boolean = false;
  private router=inject(Router);
  private notifyService = inject(NotificationService);
  unreadCount = 0;

  ngOnInit() {
    // Simple native scroll listener
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
    this.refreshNotifications();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  get isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  refreshNotifications() {
    this.notifyService.getMyNotifications().subscribe({
      next: (data) => {
        // Filter the JSON response for isRead: false
        this.unreadCount = data.filter(n => !n.isRead).length;
      },
      error: (err) => console.error('Could not fetch notification count', err)
    });
  }
}