import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuizDto } from '../../../../shared/models/quiz-dto';
import { StudentService } from '../../service/student.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="quiz-list-container">
      <header class="page-header">
        <h1>Available Quizzes</h1>
        <a routerLink="/student" class="btn btn-secondary">← Back</a>
      </header>

      <div class="quiz-content">
        <div class="quiz-grid" *ngIf="quizzes.length > 0">
          <div class="quiz-card" *ngFor="let quiz of quizzes">
            <div class="quiz-header">
              <h3>{{ quiz.title }}</h3>
              <span class="quiz-course" *ngIf="quiz.courseType">{{
                quiz.courseType
              }}</span>
            </div>

            <div class="quiz-details">
              <p class="quiz-description" *ngIf="quiz.description">
                {{ quiz.description }}
              </p>
              <div class="quiz-meta">
                <span *ngIf="quiz.trainerName">👨‍🏫 {{ quiz.trainerName }}</span>
                <span *ngIf="quiz.batchName">🎓 {{ quiz.batchName }}</span>
                <span *ngIf="quiz.timeLimit">⏱️ {{ quiz.timeLimit }} mins</span>
              </div>
              <div class="quiz-timing" *ngIf="quiz.startTime && quiz.endTime">
                <small
                  >Available: {{ quiz.startTime | date : 'short' }} -
                  {{ quiz.endTime | date : 'short' }}</small
                >
              </div>
            </div>

            <div class="quiz-actions">
              <button
                class="btn btn-primary"
                [routerLink]="['/student/quiz', quiz.id]"
                [disabled]="!isQuizAvailable(quiz)"
              >
                {{ isQuizAvailable(quiz) ? 'Start Quiz' : 'Not Available' }}
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="quizzes.length === 0 && !isLoading">
          <div class="empty-icon">📝</div>
          <h3>No Quizzes Available</h3>
          <p>There are no quizzes available for you at the moment.</p>
        </div>

        <div class="loading" *ngIf="isLoading">
          <div class="loading-spinner"></div>
          <p>Loading available quizzes...</p>
        </div>

        <div class="error" *ngIf="error">
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="loadQuizzes()">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .quiz-list-container {
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
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .quiz-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .quiz-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }

      .quiz-card {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
      }

      .quiz-card:hover {
        transform: translateY(-5px);
        border-color: #667eea;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .quiz-header h3 {
        color: #333;
        margin: 0;
        font-size: 1.3rem;
        flex: 1;
      }

      .quiz-course {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: bold;
        text-transform: uppercase;
        margin-left: 1rem;
      }

      .quiz-description {
        color: #666;
        margin-bottom: 1rem;
        line-height: 1.4;
      }

      .quiz-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .quiz-meta span {
        background: white;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.8rem;
        color: #666;
        border: 1px solid #e1e5e9;
      }

      .quiz-timing {
        margin-bottom: 1.5rem;
      }

      .quiz-timing small {
        color: #888;
        font-size: 0.8rem;
      }

      .quiz-actions {
        text-align: center;
      }

      .empty-state,
      .loading,
      .error {
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
        border-top: 4px solid #667eea;
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

      .error {
        color: #e74c3c;
      }

      @media (max-width: 768px) {
        .quiz-list-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .quiz-grid {
          grid-template-columns: 1fr;
        }

        .quiz-header {
          flex-direction: column;
          gap: 0.5rem;
        }

        .quiz-course {
          margin-left: 0;
          align-self: flex-start;
        }
      }
    `,
  ],
})
export class QuizListComponent implements OnInit {
  quizzes: QuizDto[] = [];
  isLoading = true;
  error: string = '';

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.isLoading = true;
    this.error = '';

    this.studentService.getAvailableQuizzes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.quizzes = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load quizzes';
        this.isLoading = false;
      },
    });
  }

  isQuizAvailable(quiz: QuizDto): boolean {
    if (!quiz.startTime || !quiz.endTime) return quiz.active || false;

    const now = new Date();
    const startTime = new Date(quiz.startTime);
    const endTime = new Date(quiz.endTime);

    return now >= startTime && now <= endTime && (quiz.active || false);
  }
}
