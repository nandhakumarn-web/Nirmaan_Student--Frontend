import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/Api.service';
import { AdminDashboardData } from '../../../shared/models/admin-dashboard-data';
import { ApiResponse } from '../../../shared/models/api-resonse';
import { UserRegistrationRequest } from '../../../shared/models/user-registration-request';
import { User } from '../../../shared/models/user';
import { Role } from '../../../shared/models/role';
import { StudentDto } from '../../../shared/models/student-dto';
import { TrainerDto } from '../../../shared/models/trainer-dto';
import { CourseDto } from '../../../shared/models/course-dto';
import { FeedbackDto } from '../../../shared/models/feedback-dto';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  // Dashboard
  getDashboardData(): Observable<ApiResponse<AdminDashboardData>> {
    return this.apiService.get<AdminDashboardData>('/api/dashboard/admin');
  }

  // User Management
  registerUser(user: UserRegistrationRequest): Observable<ApiResponse<User>> {
    return this.apiService.post<User>('/api/admin/users/register', user);
  }

  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.apiService.get<User[]>('/api/admin/users');
  }

  getUsersByRole(role: Role): Observable<ApiResponse<User[]>> {
    return this.apiService.get<User[]>(`/api/admin/users/role/${role}`);
  }

  // Student Management
  getAllStudents(): Observable<ApiResponse<StudentDto[]>> {
    return this.apiService.get<StudentDto[]>('/api/admin/students');
  }

  getStudent(id: number): Observable<ApiResponse<StudentDto>> {
    return this.apiService.get<StudentDto>(`/api/admin/students/${id}`);
  }

  updateStudent(
    id: number,
    student: StudentDto
  ): Observable<ApiResponse<StudentDto>> {
    return this.apiService.put<StudentDto>(
      `/api/admin/students/${id}`,
      student
    );
  }

  // Trainer Management
  getAllTrainers(): Observable<ApiResponse<TrainerDto[]>> {
    return this.apiService.get<TrainerDto[]>('/api/admin/trainers');
  }

  getTrainer(id: number): Observable<ApiResponse<TrainerDto>> {
    return this.apiService.get<TrainerDto>(`/api/admin/trainers/${id}`);
  }

  updateTrainer(
    id: number,
    trainer: TrainerDto
  ): Observable<ApiResponse<TrainerDto>> {
    return this.apiService.put<TrainerDto>(
      `/api/admin/trainers/${id}`,
      trainer
    );
  }

  // Course Management
  createCourse(course: CourseDto): Observable<ApiResponse<CourseDto>> {
    return this.apiService.post<CourseDto>('/api/admin/courses', course);
  }

  getAllCourses(): Observable<ApiResponse<CourseDto[]>> {
    return this.apiService.get<CourseDto[]>('/api/admin/courses');
  }

  updateCourse(
    id: number,
    course: CourseDto
  ): Observable<ApiResponse<CourseDto>> {
    return this.apiService.put<CourseDto>(`/api/admin/courses/${id}`, course);
  }

  // Feedback Management
  getAllFeedback(): Observable<ApiResponse<FeedbackDto[]>> {
    return this.apiService.get<FeedbackDto[]>('/api/admin/feedback');
  }
}
