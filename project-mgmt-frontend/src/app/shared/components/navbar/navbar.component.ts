import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-brand">
          <h1>Project Manager</h1>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/projects" routerLinkActive="active">Projects</a>
          <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
        </div>
        <div class="nav-user" *ngIf="currentUser$ | async as user">
          <span class="user-name">{{ user.name }}</span>
          <div class="user-avatar">{{ user.name[0] }}</div>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      text-decoration: none;
      color: #6b7280;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #667eea;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      color: #374151;
      font-weight: 500;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .logout-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  constructor() {}

  logout(): void {
    this.authService.logout();
  }
}
