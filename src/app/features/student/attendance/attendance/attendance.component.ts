import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AttendanceDto } from '../../../../shared/models/attendance-dto';
import { StudentService } from '../../service/student.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="attendance-container">
      <header class="page-header">
        <h1>Mark Attendance</h1>
        <a routerLink="/student" class="btn btn-secondary">← Back</a>
      </header>

      <div class="attendance-content">
        <div class="qr-scan-section">
          <h3>Scan QR Code</h3>
          <form [formGroup]="attendanceForm" (ngSubmit)="markAttendance()">
            <div class="form-group">
              <label for="qrCodeId">QR Code ID</label>
              <input
                type="text"
                id="qrCodeId"
                formControlName="qrCodeId"
                placeholder="Enter QR code or scan"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="attendanceForm.invalid || isMarking"
            >
              {{ isMarking ? 'Marking...' : 'Mark Attendance' }}
            </button>
          </form>
        </div>

        <div class="attendance-history">
          <h3>My Attendance History</h3>
          <div class="attendance-list" *ngIf="attendanceHistory.length > 0">
            <div
              class="attendance-item"
              *ngFor="let attendance of attendanceHistory"
            >
              <div class="attendance-date">
                {{ attendance.attendanceDate | date : 'mediumDate' }}
              </div>
              <div
                class="attendance-status"
                [ngClass]="attendance.status.toLowerCase()"
              >
                {{ attendance.status }}
              </div>
              <div class="attendance-time">
                {{ attendance.markedAt | date : 'shortTime' }}
              </div>
            </div>
          </div>
          <div
            class="empty-state"
            *ngIf="attendanceHistory.length === 0 && !isLoading"
          >
            <p>No attendance records found</p>
          </div>
          <div class="loading" *ngIf="isLoading">
            Loading attendance history...
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .attendance-container {
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn:hover {
        transform: translateY(-2px);
      }

      .attendance-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
      }

      .qr-scan-section,
      .attendance-history {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .qr-scan-section h3,
      .attendance-history h3 {
        margin-bottom: 1.5rem;
        color: #333;
      }

      .form-group {
        margin-bottom: 1.5rem;
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
        box-sizing: border-box;
      }

      .form-group input:focus {
        outline: none;
        border-color: #667eea;
      }

      .attendance-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .attendance-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        align-items: center;
      }

      .attendance-date {
        font-weight: 500;
        color: #333;
      }

      .attendance-status {
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
      }

      .attendance-status.present {
        background: #d4edda;
        color: #155724;
      }

      .attendance-status.absent {
        background: #f8d7da;
        color: #721c24;
      }

      .attendance-status.late {
        background: #fff3cd;
        color: #856404;
      }

      .attendance-time {
        color: #666;
        font-size: 0.9rem;
      }

      .empty-state,
      .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      @media (max-width: 768px) {
        .attendance-container {
          padding: 1rem;
        }

        .attendance-content {
          grid-template-columns: 1fr;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .attendance-item {
          grid-template-columns: 1fr;
          text-align: center;
        }
      }
    `,
  ],
})
export class AttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  attendanceHistory: AttendanceDto[] = [];
  isMarking = false;
  isLoading = true;

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      qrCodeId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadAttendanceHistory();
  }

  markAttendance() {
    if (this.attendanceForm.valid) {
      this.isMarking = true;
      const qrCodeId = this.attendanceForm.get('qrCodeId')?.value;

      this.studentService.markAttendance(qrCodeId).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Attendance marked successfully');
            this.attendanceForm.reset();
            this.loadAttendanceHistory();
          }
          this.isMarking = false;
        },
        error: (error) => {
          this.notificationService.error('Failed to mark attendance');
          this.isMarking = false;
        },
      });
    }
  }

  loadAttendanceHistory() {
    this.isLoading = true;
    this.studentService.getMyAttendance().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.attendanceHistory = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load attendance history');
        this.isLoading = false;
      },
    });
  }
}
