// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from './shared/models/role';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('../../src/app/features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN] },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'trainer',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.TRAINER] },
    loadChildren: () => import('./features/trainer/trainer.routes').then(m => m.trainerRoutes)
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.TRAINER, Role.STUDENT] },
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('../../src/app/features/profile/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('../../src/app/features/error/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/unauthorized'
  }
];