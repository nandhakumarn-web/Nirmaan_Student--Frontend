import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseDto } from '../../../../shared/models/course-dto';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="course-management">
      <header class="page-header">
        <h1>Course Management</h1>
        <div class="header-actions">
          <button
            class="btn btn-primary"
            (click)="showCreateForm = !showCreateForm"
          >
            {{ showCreateForm ? 'Cancel' : '+ Add Course' }}
          </button>
          <a routerLink="/admin" class="btn btn-secondary">← Back</a>
        </div>
      </header>

      <!-- Create Course Form -->
      <div class="create-form" *ngIf="showCreateForm">
        <h3>Create New Course</h3>
        <form [formGroup]="courseForm" (ngSubmit)="createCourse()">
          <div class="form-row">
            <div class="form-group">
              <label for="courseName">Course Name*</label>
              <input type="text" id="courseName" formControlName="courseName" />
            </div>
            <div class="form-group">
              <label for="courseType">Course Type*</label>
              <select id="courseType" formControlName="courseType">
                <option value="">Select Type</option>
                <option value="ITES">ITES</option>
                <option value="JAVA_FULL_STACK">Java Full Stack</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="courseForm.invalid || isCreating"
            >
              {{ isCreating ? 'Creating...' : 'Create Course' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Courses List -->
      <div class="courses-grid" *ngIf="courses.length > 0">
        <div class="course-card" *ngFor="let course of courses">
          <h4>{{ course.courseName }}</h4>
          <p>{{ course.description }}</p>
          <span class="type-badge">{{ course.courseType }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    /* Add your styles here */
  ],
})
export class CourseManagementComponent implements OnInit {
  courses: CourseDto[] = [];
  showCreateForm = false;
  isCreating = false;
  courseForm: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseType: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.adminService.getAllCourses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.courses = response.data;
        }
      },
    });
  }

  createCourse() {
    if (this.courseForm.valid) {
      this.isCreating = true;
      this.adminService.createCourse(this.courseForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.courseForm.reset();
            this.showCreateForm = false;
            this.loadCourses();
          }
          this.isCreating = false;
        },
        error: () => (this.isCreating = false),
      });
    }
  }
}
