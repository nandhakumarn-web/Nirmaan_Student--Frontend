import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from '../../src/app/shared/models/role';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN] },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'trainer',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.TRAINER] },
    loadChildren: () => import('./features/trainer/trainer.module').then(m => m.TrainerModule)
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN, Role.TRAINER, Role.STUDENT] },
    loadChildren: () => import('./features/student/student.module').then(m => m.StudentModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./features/error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '**',
    redirectTo: '/unauthorized'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }