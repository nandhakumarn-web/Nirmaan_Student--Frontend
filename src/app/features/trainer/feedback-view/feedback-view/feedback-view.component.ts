import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedbackDto } from '../../../../shared/models/feedback-dto';
import { TrainerService } from '../../service/trainer.service';

@Component({
  selector: 'app-feedback-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="feedback-view">
      <header class="page-header">
        <h1>Student Feedback</h1>
        <a routerLink="/trainer" class="btn btn-secondary">← Back</a>
      </header>

      <div class="feedback-content">
        <div class="feedback-grid" *ngIf="feedbacks.length > 0">
          <div class="feedback-card" *ngFor="let feedback of feedbacks">
            <div class="feedback-header">
              <h4>{{ feedback.feedbackType | titlecase }}</h4>
              <div class="rating">
                <span *ngFor="let star of getStars(feedback.rating)">⭐</span>
                <span class="rating-text">({{ feedback.rating }}/5)</span>
              </div>
            </div>

            <div class="feedback-meta">
              <span *ngIf="!feedback.anonymous && feedback.studentName">
                👤 {{ feedback.studentName }}
              </span>
              <span *ngIf="feedback.anonymous">👤 Anonymous</span>
              <span>📅 {{ feedback.submittedAt | date : 'short' }}</span>
            </div>

            <div class="feedback-content" *ngIf="feedback.comments">
              <p>{{ feedback.comments }}</p>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="feedbacks.length === 0 && !isLoading">
          <div class="empty-icon">💬</div>
          <h3>No Feedback Yet</h3>
          <p>No feedback has been submitted by students yet.</p>
        </div>

        <div class="loading" *ngIf="isLoading">Loading feedback...</div>
      </div>
    </div>
  `,
  styles: [
    `
      .feedback-view {
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

      .feedback-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .feedback-grid {
        display: grid;
        gap: 1.5rem;
      }

      .feedback-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #f39c12;
      }

      .feedback-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .rating-text {
        color: #666;
        font-size: 0.9rem;
        margin-left: 0.5rem;
      }

      .feedback-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        color: #666;
      }

      .btn {
        padding: 0.6rem 1.2rem;
        background: #6c757d;
        color: white;
        text-decoration: none;
        border-radius: 8px;
      }
    `,
  ],
})
export class FeedbackViewComponent implements OnInit {
  feedbacks: FeedbackDto[] = [];
  isLoading = true;

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadFeedback();
  }

  loadFeedback() {
    this.trainerService.getMyFeedback().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.feedbacks = response.data;
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
