// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard.ts/admindashboard/admindashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./student-management/student-management/student-management.component').then(m => m.StudentManagementComponent)
  },
  {
    path: 'trainers',
    loadComponent: () => import('././trainer-management/trainer-management/trainer-management.component').then(m => m.TrainerManagementComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./course-management/course-management/course-management.component').then(m => m.CourseManagementComponent)
  }
];