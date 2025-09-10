// src/app/features/student/student.routes.ts
import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./attendance/attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  {
    path: 'quizzes',
    loadComponent: () => import('./quiz/quiz-list/quiz-list.component').then(m => m.QuizListComponent)
  },
  {
    path: 'quiz/:id',
    loadComponent: () => import('./quiz/quiz-attempt/quiz-attempt.component').then(m => m.QuizAttemptComponent)
  },
  {
    path: 'feedback',
    loadComponent: () => import('./feedback/feedback/feedback.component').then(m => m.FeedbackComponent)
  }
];