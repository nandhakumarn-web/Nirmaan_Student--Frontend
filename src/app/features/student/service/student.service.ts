import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/Api.service';
import { StudentDashboardData } from '../../../shared/models/student-dashboard-data';
import { ApiResponse } from '../../../shared/models/api-resonse';
import { StudentDto } from '../../../shared/models/student-dto';
import { AttendanceDto } from '../../../shared/models/attendance-dto';
import { QuizDto } from '../../../shared/models/quiz-dto';
import { StudentQuizAttempt } from '../../../shared/models/student-quiz-attempt';
import { FeedbackDto } from '../../../shared/models/feedback-dto';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  // Dashboard
  getDashboardData(): Observable<ApiResponse<StudentDashboardData>> {
    return this.apiService.get<StudentDashboardData>('/api/dashboard/student');
  }

  // Profile Management
  getProfile(): Observable<ApiResponse<StudentDto>> {
    return this.apiService.get<StudentDto>('/api/student/profile');
  }

  updateProfile(student: StudentDto): Observable<ApiResponse<StudentDto>> {
    return this.apiService.put<StudentDto>('/api/student/profile', student);
  }

  // Attendance Management
  markAttendance(qrCodeId: string): Observable<ApiResponse<AttendanceDto>> {
    return this.apiService.post<AttendanceDto>(
      `/api/student/attendance/mark?qrCodeId=${qrCodeId}`
    );
  }

  getMyAttendance(): Observable<ApiResponse<AttendanceDto[]>> {
    return this.apiService.get<AttendanceDto[]>('/api/student/attendance');
  }

  // Quiz Management
  getAvailableQuizzes(): Observable<ApiResponse<QuizDto[]>> {
    return this.apiService.get<QuizDto[]>('/api/student/quizzes/available');
  }

  submitQuizAttempt(
    quizId: number,
    answers: any
  ): Observable<ApiResponse<StudentQuizAttempt>> {
    return this.apiService.post<StudentQuizAttempt>(
      `/api/student/quiz/${quizId}/attempt`,
      answers
    );
  }

  // Feedback Management
  submitFeedback(feedback: FeedbackDto): Observable<ApiResponse<FeedbackDto>> {
    return this.apiService.post<FeedbackDto>('/api/student/feedback', feedback);
  }
}
