// src/app/features/admin/user-management/user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../../../shared/models/user';
import { AdminService } from '../../service/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserRegistrationRequest } from '../../../../shared/models/user-registration-request';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="user-management">
      <header class="page-header">
        <h1>User Management</h1>
        <div class="header-actions">
          <button
            class="btn btn-primary"
            (click)="showCreateForm = !showCreateForm"
          >
            {{ showCreateForm ? 'Cancel' : '+ Add User' }}
          </button>
          <a routerLink="/admin" class="btn btn-secondary">← Back</a>
        </div>
      </header>

      <!-- Create User Form -->
      <div class="create-form" *ngIf="showCreateForm">
        <h3>Create New User</h3>
        <form [formGroup]="userForm" (ngSubmit)="createUser()">
          <div class="form-row">
            <div class="form-group">
              <label for="username">Username*</label>
              <input type="text" id="username" formControlName="username" />
            </div>
            <div class="form-group">
              <label for="email">Email*</label>
              <input type="email" id="email" formControlName="email" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name*</label>
              <input type="text" id="firstName" formControlName="firstName" />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name*</label>
              <input type="text" id="lastName" formControlName="lastName" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Password*</label>
              <input type="password" id="password" formControlName="password" />
            </div>
            <div class="form-group">
              <label for="role">Role*</label>
              <select id="role" formControlName="role">
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="TRAINER">Trainer</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                formControlName="phoneNumber"
              />
            </div>
            <div
              class="form-group"
              *ngIf="userForm.get('role')?.value === 'STUDENT'"
            >
              <label for="enrolledCourse">Course</label>
              <select id="enrolledCourse" formControlName="enrolledCourse">
                <option value="">Select Course</option>
                <option value="ITES">ITES</option>
                <option value="JAVA_FULL_STACK">Java Full Stack</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="userForm.invalid || isCreating"
            >
              {{ isCreating ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Users List -->
      <div class="users-section">
        <div class="section-header">
          <h3>All Users</h3>
          <div class="filters">
            <select (change)="filterByRole($event)" class="filter-select">
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="TRAINER">Trainer</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>
        </div>

        <div class="users-grid" *ngIf="filteredUsers.length > 0">
          <div class="user-card" *ngFor="let user of filteredUsers">
            <div class="user-avatar">
              <span>{{ user.firstName[0] }}{{ user.lastName[0] }}</span>
            </div>
            <div class="user-info">
              <h4>{{ user.firstName }} {{ user.lastName }}</h4>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-username">{{ user.username }}</p>
              <span class="role-badge" [ngClass]="user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </div>
            <div class="user-actions">
              <span
                class="status"
                [ngClass]="{ active: user.active, inactive: !user.active }"
              >
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

        <div class="loading" *ngIf="isLoading">Loading users...</div>

        <div
          class="empty-state"
          *ngIf="!isLoading && filteredUsers.length === 0"
        >
          <p>No users found</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-management {
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

      .header-actions {
        display: flex;
        gap: 1rem;
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

      .create-form {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .create-form h3 {
        margin-bottom: 1.5rem;
        color: #333;
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

      .form-group input,
      .form-group select {
        padding: 0.8rem;
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #667eea;
      }

      .form-actions {
        margin-top: 1.5rem;
        text-align: right;
      }

      .users-section {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .section-header h3 {
        margin: 0;
        color: #333;
      }

      .filter-select {
        padding: 0.5rem 1rem;
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        background: white;
      }

      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .user-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease;
      }

      .user-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      }

      .user-info {
        flex: 1;
      }

      .user-info h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }

      .user-email {
        margin: 0 0 0.25rem 0;
        color: #666;
        font-size: 0.9rem;
      }

      .user-username {
        margin: 0 0 0.5rem 0;
        color: #888;
        font-size: 0.8rem;
      }

      .role-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: bold;
        text-transform: uppercase;
      }

      .role-badge.admin {
        background: #fee;
        color: #c53030;
      }
      .role-badge.trainer {
        background: #fff3cd;
        color: #856404;
      }
      .role-badge.student {
        background: #d1ecf1;
        color: #0c5460;
      }

      .user-actions {
        text-align: right;
      }

      .status {
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status.active {
        background: #d4edda;
        color: #155724;
      }

      .status.inactive {
        background: #f8d7da;
        color: #721c24;
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      @media (max-width: 768px) {
        .user-management {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .users-grid {
          grid-template-columns: 1fr;
        }

        .section-header {
          flex-direction: column;
          gap: 1rem;
        }
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  showCreateForm = false;
  isLoading = true;
  isCreating = false;
  userForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      phoneNumber: [''],
      enrolledCourse: [''],
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
          this.filteredUsers = this.users;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load users');
        this.isLoading = false;
      },
    });
  }

  createUser() {
    if (this.userForm.valid) {
      this.isCreating = true;
      const userData: UserRegistrationRequest = this.userForm.value;

      this.adminService.registerUser(userData).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('User created successfully');
            this.userForm.reset();
            this.showCreateForm = false;
            this.loadUsers();
          }
          this.isCreating = false;
        },
        error: (error) => {
          this.notificationService.error('Failed to create user');
          this.isCreating = false;
        },
      });
    }
  }

  filterByRole(event: any) {
    const role = event.target.value;
    if (role) {
      this.filteredUsers = this.users.filter((user) => user.role === role);
    } else {
      this.filteredUsers = this.users;
    }
  }
}
