// src/app/features/admin/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardData } from '../../../../shared/models/admin-dashboard-data';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <nav class="dashboard-nav">
          <a routerLink="/admin/users" class="nav-link">Users</a>
          <a routerLink="/admin/students" class="nav-link">Students</a>
          <a routerLink="/admin/trainers" class="nav-link">Trainers</a>
          <a routerLink="/admin/courses" class="nav-link">Courses</a>
          <a routerLink="/dashboard" class="nav-link back-link"
            >← Back to Main</a
          >
        </nav>
      </header>

      <div class="stats-grid" *ngIf="dashboardData">
        <div class="stat-card users">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalUsers }}</h3>
            <p>Total Users</p>
            <small>{{ dashboardData.activeUsers }} Active</small>
          </div>
        </div>

        <div class="stat-card students">
          <div class="stat-icon">👨‍🎓</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalStudents }}</h3>
            <p>Students</p>
          </div>
        </div>

        <div class="stat-card trainers">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalTrainers }}</h3>
            <p>Trainers</p>
          </div>
        </div>

        <div class="stat-card courses">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalCourses }}</h3>
            <p>Courses</p>
            <small>{{ dashboardData.activeCourses }} Active</small>
          </div>
        </div>

        <div class="stat-card batches">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalBatches }}</h3>
            <p>Batches</p>
            <small>{{ dashboardData.activeBatches }} Active</small>
          </div>
        </div>

        <div class="stat-card quizzes">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalQuizzes }}</h3>
            <p>Quizzes</p>
            <small>{{ dashboardData.activeQuizzes }} Active</small>
          </div>
        </div>

        <div class="stat-card attendance">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>{{ dashboardData.todayAttendance }}</h3>
            <p>Today's Attendance</p>
          </div>
        </div>

        <div class="stat-card feedback">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <h3>{{ dashboardData.totalFeedback }}</h3>
            <p>Total Feedback</p>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="!dashboardData && !error">
        Loading dashboard data...
      </div>

      <div class="error" *ngIf="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [
    `
      .admin-dashboard {
        padding: 2rem;
        background: #f8f9fa;
        min-height: 100vh;
      }

      .dashboard-header {
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .dashboard-header h1 {
        color: #333;
        margin: 0;
        font-size: 2rem;
      }

      .dashboard-nav {
        display: flex;
        gap: 1rem;
      }

      .nav-link {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        padding: 0.6rem 1.2rem;
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

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
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

      .users .stat-icon {
        background: #e3f2fd;
      }
      .students .stat-icon {
        background: #e8f5e8;
      }
      .trainers .stat-icon {
        background: #fff3e0;
      }
      .courses .stat-icon {
        background: #fce4ec;
      }
      .batches .stat-icon {
        background: #f3e5f5;
      }
      .quizzes .stat-icon {
        background: #e0f2f1;
      }
      .attendance .stat-icon {
        background: #fff8e1;
      }
      .feedback .stat-icon {
        background: #f1f8e9;
      }

      .stat-content h3 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        color: #333;
        font-weight: 600;
      }

      .stat-content p {
        margin: 0 0 0.25rem 0;
        color: #666;
        font-weight: 500;
      }

      .stat-content small {
        color: #888;
        font-size: 0.8rem;
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

      @media (max-width: 768px) {
        .admin-dashboard {
          padding: 1rem;
        }

        .dashboard-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .dashboard-nav {
          flex-wrap: wrap;
          justify-content: center;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: AdminDashboardData | null = null;
  error: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getDashboardData().subscribe({
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
