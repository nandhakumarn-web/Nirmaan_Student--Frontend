// src/app/features/admin/trainer-management/trainer-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrainerDto } from '../../../../shared/models/trainer-dto';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-trainer-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="trainer-management">
      <header class="page-header">
        <h1>Trainer Management</h1>
        <a routerLink="/admin" class="btn btn-secondary">← Back</a>
      </header>

      <div class="trainers-grid" *ngIf="trainers.length > 0">
        <div class="trainer-card" *ngFor="let trainer of trainers">
          <div class="trainer-info">
            <h4>{{ trainer.firstName }} {{ trainer.lastName }}</h4>
            <p class="trainer-email">{{ trainer.email }}</p>
            <p class="trainer-username">{{ trainer.username }}</p>
            <div class="trainer-details" *ngIf="trainer.specialization || trainer.experienceYears">
              <span class="specialization-badge" *ngIf="trainer.specialization">
                {{ trainer.specialization }}
              </span>
              <span class="experience-badge" *ngIf="trainer.experienceYears">
                {{ trainer.experienceYears }} years exp.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="trainers.length === 0 && !isLoading">
        <div class="empty-icon">👨‍🏫</div>
        <h3>No Trainers Found</h3>
        <p>No trainers have been registered yet.</p>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading trainers...</p>
      </div>
    </div>
  `,
  styles: [`
    .trainer-management {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      background: white;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h1 {
      margin: 0;
      color: #333;
    }

    .btn {
      padding: 0.6rem 1.2rem;
      background: #6c757d;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .trainers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .trainer-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .trainer-card:hover {
      transform: translateY(-5px);
    }

    .trainer-info h4 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
    }

    .trainer-email {
      color: #666;
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .trainer-username {
      color: #888;
      margin: 0 0 1rem 0;
      font-size: 0.8rem;
    }

    .trainer-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .specialization-badge {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .experience-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .empty-state, .loading {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .trainer-management {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .trainers-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TrainerManagementComponent implements OnInit {
  trainers: TrainerDto[] = [];
  isLoading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.adminService.getAllTrainers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.trainers = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load trainers:', error);
        this.isLoading = false;
      }
    });
  }
}