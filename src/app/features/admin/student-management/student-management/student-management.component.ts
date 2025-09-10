import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentDto } from '../../../../shared/models/student-dto';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="student-management">
      <header class="page-header">
        <h1>Student Management</h1>
        <a routerLink="/admin" class="btn btn-secondary">← Back</a>
      </header>

      <div class="students-grid" *ngIf="students.length > 0">
        <div class="student-card" *ngFor="let student of students">
          <div class="student-info">
            <h4>{{ student.firstName }} {{ student.lastName }}</h4>
            <p>{{ student.email }}</p>
            <span class="course-badge" *ngIf="student.enrolledCourse">
              {{ student.enrolledCourse }}
            </span>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">Loading students...</div>
    </div>
  `,
  styles: [
    /* Add your styles here */
  ],
})
export class StudentManagementComponent implements OnInit {
  students: StudentDto[] = [];
  isLoading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.adminService.getAllStudents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.students = response.data;
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }
}
