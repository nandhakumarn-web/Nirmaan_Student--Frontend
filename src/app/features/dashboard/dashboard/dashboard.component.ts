// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../shared/models/role';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="nav-brand">
          <h2>Nirmaan SMS</h2>
        </div>
        <div class="nav-user">
          <span>Welcome, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </nav>

      <main class="main-content">
        <div class="dashboard-header">
          <h1>Dashboard</h1>
          <p>Choose your role to continue</p>
        </div>

        <div class="role-cards">
          <div 
            *ngIf="hasRole(Role.ADMIN)" 
            class="role-card admin-card"
            (click)="navigateTo('/admin')"
          >
            <div class="card-icon">👨‍💼</div>
            <h3>Admin Panel</h3>
            <p>Manage users, courses, and system settings</p>
            <div class="card-features">
              <span>• User Management</span>
              <span>• Course Management</span>
              <span>• System Analytics</span>
            </div>
          </div>

          <div 
            *ngIf="hasRole(Role.TRAINER)" 
            class="role-card trainer-card"
            (click)="navigateTo('/trainer')"
          >
            <div class="card-icon">👨‍🏫</div>
            <h3>Trainer Panel</h3>
            <p>Create quizzes, manage attendance, and track progress</p>
            <div class="card-features">
              <span>• Quiz Management</span>
              <span>• Attendance Tracking</span>
              <span>• Student Progress</span>
            </div>
          </div>

          <div 
            *ngIf="hasRole(Role.STUDENT)" 
            class="role-card student-card"
            (click)="navigateTo('/student')"
          >
            <div class="card-icon">👨‍🎓</div>
            <h3>Student Panel</h3>
            <p>Take quizzes, mark attendance, and provide feedback</p>
            <div class="card-features">
              <span>• Take Quizzes</span>
              <span>• Mark Attendance</span>
              <span>• Submit Feedback</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button class="action-btn" (click)="navigateTo('/profile')">
              👤 My Profile
            </button>
            <button class="action-btn" *ngIf="hasRole(Role.STUDENT)" (click)="navigateTo('/student/attendance')">
              📅 Mark Attendance
            </button>
            <button class="action-btn" *ngIf="hasRole(Role.TRAINER)" (click)="navigateTo('/trainer/quiz')">
              📝 Create Quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .nav-brand h2 {
      margin: 0;
      font-weight: 600;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logout-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: rgba(255,255,255,0.3);
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .role-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .role-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      border: 2px solid transparent;
    }

    .role-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }

    .admin-card:hover { border-color: #e74c3c; }
    .trainer-card:hover { border-color: #f39c12; }
    .student-card:hover { border-color: #3498db; }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .role-card h3 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    .role-card p {
      color: #666;
      margin-bottom: 1rem;
    }

    .card-features {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .card-features span {
      color: #888;
      font-size: 0.9rem;
    }

    .quick-actions {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .quick-actions h3 {
      color: #333;
      margin-bottom: 1rem;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
      font-weight: 500;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }

      .role-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  Role = Role;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  hasRole(role: Role): boolean {
    return this.authService.hasRole(role);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}