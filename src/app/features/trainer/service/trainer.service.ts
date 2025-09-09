import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/Api.service';
import { TrainerDashboardData } from '../../../shared/models/trainer-dashboard-data';
import { ApiResponse } from '../../../shared/models/api-resonse';
import { TrainerDto } from '../../../shared/models/trainer-dto';
import { QuizDto } from '../../../shared/models/quiz-dto';
import { AttendanceDto } from '../../../shared/models/attendance-dto';
import { FeedbackDto } from '../../../shared/models/feedback-dto';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  constructor(private apiService: ApiService) {}

  // Dashboard
  getDashboardData(): Observable<ApiResponse<TrainerDashboardData>> {
    return this.apiService.get<TrainerDashboardData>('/api/dashboard/trainer');
  }

  // Profile Management
  getProfile(): Observable<ApiResponse<TrainerDto>> {
    return this.apiService.get<TrainerDto>('/api/trainer/profile');
  }

  updateProfile(trainer: TrainerDto): Observable<ApiResponse<TrainerDto>> {
    return this.apiService.put<TrainerDto>('/api/trainer/profile', trainer);
  }

  // Quiz Management
  createQuiz(quiz: QuizDto): Observable<ApiResponse<QuizDto>> {
    return this.apiService.post<QuizDto>('/api/trainer/quiz', quiz);
  }

  getMyQuizzes(): Observable<ApiResponse<QuizDto[]>> {
    return this.apiService.get<QuizDto[]>('/api/trainer/quizzes');
  }

  // Attendance Management
  getAttendanceByDate(date: string): Observable<ApiResponse<AttendanceDto[]>> {
    return this.apiService.get<AttendanceDto[]>(
      `/api/trainer/attendance?date=${date}`
    );
  }

  // Feedback
  getMyFeedback(): Observable<ApiResponse<FeedbackDto[]>> {
    return this.apiService.get<FeedbackDto[]>('/api/trainer/feedback');
  }
}
