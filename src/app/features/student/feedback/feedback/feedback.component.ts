import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../service/student.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FeedbackDto } from '../../../../shared/models/feedback-dto';
import { FeedbackType } from '../../../../shared/models/feedback-type';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="feedback-container">
      <header class="page-header">
        <h1>Submit Feedback</h1>
        <a routerLink="/student" class="btn btn-secondary">← Back</a>
      </header>

      <div class="feedback-content">
        <div class="feedback-form-section">
          <h3>Share Your Feedback</h3>
          <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
            <div class="form-group">
              <label for="feedbackType">Feedback Type*</label>
              <select id="feedbackType" formControlName="feedbackType">
                <option value="">Select Type</option>
                <option value="COURSE_FEEDBACK">Course Feedback</option>
                <option value="TRAINER_FEEDBACK">Trainer Feedback</option>
                <option value="SYSTEM_FEEDBACK">System Feedback</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="rating">Rating* (1-5)</label>
                <select id="rating" formControlName="rating">
                  <option value="">Select Rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" formControlName="anonymous">
                  Submit anonymously
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="comments">Comments</label>
              <textarea 
                id="comments" 
                formControlName="comments" 
                rows="5" 
                placeholder="Please share your detailed feedback..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="feedbackForm.invalid || isSubmitting"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
              </button>
            </div>
          </form>
        </div>

        <div class="feedback-guide">
          <h4>Feedback Guidelines</h4>
          <ul>
            <li><strong>Course Feedback:</strong> Share your thoughts about the course content, difficulty, and usefulness.</li>
            <li><strong>Trainer Feedback:</strong> Provide feedback about the trainer's teaching methods and effectiveness.</li>
            <li><strong>System Feedback:</strong> Report any issues or suggestions about the learning management system.</li>
            <li><strong>Be Constructive:</strong> Provide specific and actionable feedback that can help improve the experience.</li>
            <li><strong>Be Respectful:</strong> Maintain a professional tone in your feedback.</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
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

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .feedback-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .feedback-form-section, .feedback-guide {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .feedback-form-section h3, .feedback-guide h4 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .form-group input[type="checkbox"] {
      margin-right: 0.5rem;
    }

    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.8rem;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group textarea {
      resize: vertical;
      font-family: inherit;
    }

    .form-actions {
      text-align: center;
      margin-top: 2rem;
    }

    .feedback-guide ul {
      list-style: none;
      padding: 0;
    }

    .feedback-guide li {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .feedback-guide li strong {
      color: #333;
    }

    @media (max-width: 768px) {
      .feedback-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .feedback-content {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  isSubmitting = false;

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      feedbackType: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      comments: [''],
      anonymous: [false]
    });
  }

  ngOnInit() {}

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.isSubmitting = true;
      const feedbackData: FeedbackDto = {
        feedbackType: this.feedbackForm.get('feedbackType')?.value as FeedbackType,
        rating: parseInt(this.feedbackForm.get('rating')?.value),
        comments: this.feedbackForm.get('comments')?.value,
        anonymous: this.feedbackForm.get('anonymous')?.value
      };

      this.studentService.submitFeedback(feedbackData).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Feedback submitted successfully');
            this.feedbackForm.reset();
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          this.notificationService.error('Failed to submit feedback');
          this.isSubmitting = false;
        }
      });
    }
  }
}