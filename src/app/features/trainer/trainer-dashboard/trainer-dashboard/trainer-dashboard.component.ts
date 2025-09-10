import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrainerDashboardData } from '../../../../shared/models/trainer-dashboard-data';
import { User } from '../../../../shared/models/user';
import { TrainerService } from '../../service/trainer.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="trainer-dashboard">
      <header class="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.firstName }}!</span>
        </div>
        <nav class="dashboard-nav">
          <a routerLink="/trainer/quiz" class="nav-link">📝 Quiz Management</a>
          <a routerLink="/trainer/attendance" class="nav-link">📅 Attendance</a>
          <a routerLink="/trainer/feedback" class="nav-link">💬 Feedback</a>
          <a routerLink="/dashboard" class="nav-link back-link"
            >← Back to Main</a
          >
        </nav>
      </header>

      <div class="dashboard-content" *ngIf="dashboardData">
        <div class="stats-cards">
          <div class="stat-card batches">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <h3>{{ dashboardData.totalBatches }}</h3>
              <p>My Batches</p>
            </div>
          </div>

          <div class="stat-card quizzes">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <h3>{{ dashboardData.totalQuizzes }}</h3>
              <p>Created Quizzes</p>
              <a routerLink="/trainer/quiz" class="stat-link">Create New →</a>
            </div>
          </div>

          <div class="stat-card attendance">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>{{ dashboardData.todayAttendance }}</h3>
              <p>Today's Attendance</p>
              <a routerLink="/trainer/attendance" class="stat-link"
                >View Details →</a
              >
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-grid">
            <div class="action-card" routerLink="/trainer/quiz">
              <div class="action-icon">➕</div>
              <h4>Create Quiz</h4>
              <p>Create new quizzes for your students</p>
            </div>

            <div class="action-card" routerLink="/trainer/attendance">
              <div class="action-icon">📊</div>
              <h4>Track Attendance</h4>
              <p>Monitor student attendance records</p>
            </div>

            <div class="action-card" routerLink="/trainer/feedback">
              <div class="action-icon">⭐</div>
              <h4>View Feedback</h4>
              <p>Check feedback from your students</p>
            </div>

            <div class="action-card" routerLink="/profile">
              <div class="action-icon">👤</div>
              <h4>My Profile</h4>
              <p>Update your profile information</p>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="!dashboardData && !error">
        Loading your dashboard...
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadDashboardData()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .trainer-dashboard {
        padding: 2rem;
        background: #f8f9fa;
        min-height: 100vh;
      }

      .dashboard-header {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        color: #333;
        margin: 0 0 0.5rem 0;
        font-size: 2.2rem;
      }

      .user-info {
        color: #666;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
      }

      .dashboard-nav {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .nav-link {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        color: white;
        text-decoration: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        transition: transform 0.2s;
        font-weight: 500;
      }

      .nav-link:hover {
        transform: translateY(-2px);
      }

      .back-link {
        background: linear-gradient(
          135deg,
          #95a5a6 0%,
          #7f8c8d 100%
        ) !important;
      }

      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: transform 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-5px);
      }

      .stat-icon {
        font-size: 2.5rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: #f8f9fa;
      }

      .batches .stat-icon {
        background: #fff3e0;
      }
      .quizzes .stat-icon {
        background: #e3f2fd;
      }
      .attendance .stat-icon {
        background: #e8f5e8;
      }

      .stat-content h3 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        color: #333;
        font-weight: 600;
      }

      .stat-content p {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-weight: 500;
      }

      .stat-link {
        color: #f39c12;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .stat-link:hover {
        text-decoration: underline;
      }

      .quick-actions {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .quick-actions h3 {
        color: #333;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .action-card {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        color: inherit;
      }

      .action-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        background: #e9ecef;
      }

      .action-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      .action-card h4 {
        color: #333;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }

      .action-card p {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .loading,
      .error {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .error {
        color: #e74c3c;
      }

      .btn {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 1rem;
      }

      @media (max-width: 768px) {
        .trainer-dashboard {
          padding: 1rem;
        }

        .dashboard-header {
          padding: 1.5rem;
        }

        .dashboard-nav {
          justify-content: center;
        }

        .stats-cards,
        .action-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TrainerDashboardComponent implements OnInit {
  dashboardData: TrainerDashboardData | null = null;
  currentUser: User | null = null;
  error: string = '';

  constructor(
    private trainerService: TrainerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.trainerService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dashboardData = response.data;
        }
      },
      error: (error) => {
        this.error = 'Failed to load dashboard data';
        console.error('Dashboard error:', error);
      },
    });
  }
}
