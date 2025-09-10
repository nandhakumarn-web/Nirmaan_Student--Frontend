import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <h1>My Profile</h1>
        <a routerLink="/dashboard" class="btn btn-secondary">← Back to Dashboard</a>
      </header>

      <div class="profile-content" *ngIf="currentUser">
        <div class="profile-card">
          <div class="profile-avatar">
            <span>{{ currentUser.firstName[0] }}{{ currentUser.lastName[0] }}</span>
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" formControlName="firstName" />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" formControlName="lastName" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" formControlName="username" readonly />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email" readonly />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="role">Role</label>
                <input type="text" id="role" [value]="currentUser.role" readonly />
              </div>
              <div class="form-group">
                <label for="phoneNumber">Phone Number</label>
                <input type="text" id="phoneNumber" formControlName="phoneNumber" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || isUpdating">
                {{ isUpdating ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .profile-header {
      background: white;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-header h1 {
      margin: 0;
      color: #333;
    }

    .btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.5rem;
      margin: 0 auto 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      padding: 0.8rem;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input[readonly] {
      background: #f8f9fa;
      color: #666;
    }

    .form-actions {
      margin-top: 2rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isUpdating = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: [''],
      email: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue(this.currentUser);
    }
  }

  updateProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.isUpdating = true;
      // Here you would typically call a profile update service
      // For now, just simulate the update
      setTimeout(() => {
        this.notificationService.success('Profile updated successfully');
        this.isUpdating = false;
      }, 1000);
    }
  }
}
