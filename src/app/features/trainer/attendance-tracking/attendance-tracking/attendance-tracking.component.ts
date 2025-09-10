import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AttendanceDto } from '../../../../shared/models/attendance-dto';
import { TrainerService } from '../../service/trainer.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-attendance-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="attendance-tracking">
      <header class="page-header">
        <h1>Attendance Tracking</h1>
        <a routerLink="/trainer" class="btn btn-secondary">← Back</a>
      </header>

      <div class="tracking-content">
        <div class="date-selector">
          <form [formGroup]="dateForm" (ngSubmit)="loadAttendance()">
            <div class="form-group">
              <label for="selectedDate">Select Date</label>
              <input
                type="date"
                id="selectedDate"
                formControlName="selectedDate"
              />
            </div>
            <button type="submit" class="btn btn-primary">
              Load Attendance
            </button>
          </form>
        </div>

        <div class="attendance-summary" *ngIf="attendanceRecords.length > 0">
          <h3>Attendance Summary - {{ selectedDate | date : 'fullDate' }}</h3>
          <div class="summary-stats">
            <div class="stat-item present">
              <h4>{{ getPresentCount() }}</h4>
              <p>Present</p>
            </div>
            <div class="stat-item absent">
              <h4>{{ getAbsentCount() }}</h4>
              <p>Absent</p>
            </div>
            <div class="stat-item late">
              <h4>{{ getLateCount() }}</h4>
              <p>Late</p>
            </div>
            <div class="stat-item total">
              <h4>{{ attendanceRecords.length }}</h4>
              <p>Total Students</p>
            </div>
          </div>
        </div>

        <div class="attendance-list" *ngIf="attendanceRecords.length > 0">
          <h3>Student Attendance Records</h3>
          <div class="attendance-table">
            <div class="table-header">
              <div>Student Name</div>
              <div>Batch</div>
              <div>Status</div>
              <div>Time</div>
            </div>
            <div class="table-row" *ngFor="let record of attendanceRecords">
              <div class="student-name">{{ record.studentName }}</div>
              <div class="batch-name">{{ record.batchName }}</div>
              <div class="status" [ngClass]="record.status.toLowerCase()">
                {{ record.status }}
              </div>
              <div class="time">
                {{ record.markedAt | date : 'shortTime' }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="empty-state"
          *ngIf="attendanceRecords.length === 0 && !isLoading && selectedDate"
        >
          <div class="empty-icon">📅</div>
          <h3>No Attendance Records</h3>
          <p>
            No attendance records found for
            {{ selectedDate | date : 'mediumDate' }}
          </p>
        </div>

        <div class="loading" *ngIf="isLoading">
          <div class="loading-spinner"></div>
          <p>Loading attendance records...</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .attendance-tracking {
        padding: 2rem;
        background: #f8f9fa;
        min-height: 100vh;
      }

      .page-header {
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .page-header h1 {
        margin: 0;
        color: #333;
      }

      .btn {
        padding: 0.6rem 1.2rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        text-decoration: none;
        display: inline-block;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        color: white;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn:hover {
        transform: translateY(-2px);
      }

      .tracking-content > div {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .date-selector form {
        display: flex;
        align-items: end;
        gap: 1rem;
      }

      .form-group {
        flex: 1;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
      }

      .form-group input {
        width: 100%;
        padding: 0.8rem;
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s;
      }

      .form-group input:focus {
        outline: none;
        border-color: #f39c12;
      }

      .attendance-summary h3 {
        color: #333;
        margin-bottom: 1.5rem;
      }

      .summary-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .stat-item {
        text-align: center;
        padding: 1.5rem;
        border-radius: 12px;
        background: #f8f9fa;
      }

      .stat-item h4 {
        font-size: 2rem;
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      .stat-item p {
        margin: 0;
        color: #666;
        font-weight: 500;
      }

      .stat-item.present {
        background: #d4edda;
        border-left: 4px solid #28a745;
      }

      .stat-item.present h4 {
        color: #155724;
      }

      .stat-item.absent {
        background: #f8d7da;
        border-left: 4px solid #dc3545;
      }

      .stat-item.absent h4 {
        color: #721c24;
      }

      .stat-item.late {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
      }

      .stat-item.late h4 {
        color: #856404;
      }

      .stat-item.total {
        background: #d1ecf1;
        border-left: 4px solid #17a2b8;
      }

      .stat-item.total h4 {
        color: #0c5460;
      }

      .attendance-list h3 {
        color: #333;
        margin-bottom: 1.5rem;
      }

      .attendance-table {
        display: grid;
        gap: 0.5rem;
      }

      .table-header,
      .table-row {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem;
        align-items: center;
      }

      .table-header {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
        border-radius: 8px;
      }

      .table-row {
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        transition: transform 0.2s;
      }

      .table-row:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .student-name {
        font-weight: 500;
        color: #333;
      }

      .batch-name {
        color: #666;
      }

      .status {
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
      }

      .status.present {
        background: #d4edda;
        color: #155724;
      }

      .status.absent {
        background: #f8d7da;
        color: #721c24;
      }

      .status.late {
        background: #fff3cd;
        color: #856404;
      }

      .time {
        color: #666;
        font-size: 0.9rem;
      }

      .empty-state,
      .loading {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        color: #333;
        margin-bottom: 0.5rem;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #f39c12;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .attendance-tracking {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .date-selector form {
          flex-direction: column;
          align-items: stretch;
        }

        .summary-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .table-header,
        .table-row {
          grid-template-columns: 1fr;
          text-align: center;
        }
      }
    `,
  ],
})
export class AttendanceTrackingComponent implements OnInit {
  attendanceRecords: AttendanceDto[] = [];
  dateForm: FormGroup;
  isLoading = false;
  selectedDate: string = '';

  constructor(
    private trainerService: TrainerService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      selectedDate: [new Date().toISOString().split('T')[0]],
    });
  }

  ngOnInit() {
    // Load today's attendance by default
    this.loadAttendance();
  }

  loadAttendance() {
    const selectedDate = this.dateForm.get('selectedDate')?.value;
    if (!selectedDate) return;

    this.selectedDate = selectedDate;
    this.isLoading = true;

    this.trainerService.getAttendanceByDate(selectedDate).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.attendanceRecords = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load attendance records');
        this.isLoading = false;
      },
    });
  }

  getPresentCount(): number {
    return this.attendanceRecords.filter(
      (record) => record.status === 'PRESENT'
    ).length;
  }

  getAbsentCount(): number {
    return this.attendanceRecords.filter((record) => record.status === 'ABSENT')
      .length;
  }

  getLateCount(): number {
    return this.attendanceRecords.filter((record) => record.status === 'LATE')
      .length;
  }
}
