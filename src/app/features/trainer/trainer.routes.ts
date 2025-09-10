import { Routes } from '@angular/router';

export const trainerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./trainer-dashboard/trainer-dashboard.component').then(m => m.TrainerDashboardComponent)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./quiz-management/quiz-management.component').then(m => m.QuizManagementComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./attendance-tracking/attendance-tracking.component').then(m => m.AttendanceTrackingComponent)
  },
  {
    path: 'feedback',
    loadComponent: () => import('./feedback-view/feedback-view.component').then(m => m.FeedbackViewComponent)
  }
];