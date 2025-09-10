// src/app/features/trainer/quiz-management/quiz-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuizDto } from '../../../../shared/models/quiz-dto';
import { TrainerService } from '../../service/trainer.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-quiz-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="quiz-management">
      <header class="page-header">
        <h1>Quiz Management</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showCreateForm = !showCreateForm">
            {{ showCreateForm ? 'Cancel' : '+ Create Quiz' }}
          </button>
          <a routerLink="/trainer" class="btn btn-secondary">← Back</a>
        </div>
      </header>

      <!-- Create Quiz Form -->
      <div class="create-form" *ngIf="showCreateForm">
        <h3>Create New Quiz</h3>
        <form [formGroup]="quizForm" (ngSubmit)="createQuiz()">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Quiz Title*</label>
              <input type="text" id="title" formControlName="title" />
            </div>
            <div class="form-group">
              <label for="timeLimit">Time Limit (minutes)*</label>
              <input type="number" id="timeLimit" formControlName="timeLimit" />
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" formControlName="description" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="courseType">Course Type</label>
              <select id="courseType" formControlName="courseType">
                <option value="">Select Course</option>
                <option value="ITES">ITES</option>
                <option value="JAVA_FULL_STACK">Java Full Stack</option>
              </select>
            </div>
            <div class="form-group">
              <label for="batchName">Batch Name</label>
              <input type="text" id="batchName" formControlName="batchName" />
            </div>
          </div>

          <div class="questions-section">
            <h4>Questions</h4>
            <div formArrayName="questions">
              <div *ngFor="let question of questionsArray.controls; let i = index" 
                   [formGroupName]="i" class="question-form">
                <h5>Question {{ i + 1 }}</h5>
                <div class="form-group">
                  <label>Question Text*</label>
                  <input type="text" formControlName="questionText" />
                </div>
                <div class="options-grid">
                  <div class="form-group">
                    <label>Option A*</label>
                    <input type="text" formControlName="optionA" />
                  </div>
                  <div class="form-group">
                    <label>Option B*</label>
                    <input type="text" formControlName="optionB" />
                  </div>
                  <div class="form-group">
                    <label>Option C*</label>
                    <input type="text" formControlName="optionC" />
                  </div>
                  <div class="form-group">
                    <label>Option D*</label>
                    <input type="text" formControlName="optionD" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Correct Answer*</label>
                    <select formControlName="correctAnswer">
                      <option value="">Select Answer</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Marks</label>
                    <input type="number" formControlName="marks" value="1" />
                  </div>
                </div>
                <button type="button" class="btn btn-danger btn-sm" (click)="removeQuestion(i)">
                  Remove Question
                </button>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" (click)="addQuestion()">
              + Add Question
            </button>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="quizForm.invalid || isCreating">
              {{ isCreating ? 'Creating...' : 'Create Quiz' }}
            </button>
          </div>
        </form>
      </div>

      <!-- My Quizzes -->
      <div class="quizzes-section">
        <h3>My Quizzes</h3>
        <div class="quizzes-grid" *ngIf="quizzes.length > 0">
          <div class="quiz-card" *ngFor="let quiz of quizzes">
            <div class="quiz-header">
              <h4>{{ quiz.title }}</h4>
              <span class="status-badge" [ngClass]="{ active: quiz.active, inactive: !quiz.active }">
                {{ quiz.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p *ngIf="quiz.description">{{ quiz.description }}</p>
            <div class="quiz-meta">
              <span *ngIf="quiz.courseType">📚 {{ quiz.courseType }}</span>
              <span *ngIf="quiz.timeLimit">⏱️ {{ quiz.timeLimit }} mins</span>
              <span *ngIf="quiz.questions">❓ {{ quiz.questions.length }} questions</span>
            </div>
          </div>
        </div>
        <div class="empty-state" *ngIf="quizzes.length === 0 && !isLoading">
          <p>No quizzes created yet</p>
        </div>
        <div class="loading" *ngIf="isLoading">Loading quizzes...</div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-management {
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

    .header-actions {
      display: flex;
      gap: 1rem;
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

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .create-form, .quizzes-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .create-form h3, .quizzes-section h3 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
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
      border-color: #f39c12;
    }

    .questions-section {
      margin-top: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .questions-section h4 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .question-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 2px solid #e1e5e9;
    }

    .question-form h5 {
      color: #333;
      margin-bottom: 1rem;
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #e1e5e9;
    }

    .quizzes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .quiz-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      transition: transform 0.3s ease;
    }

    .quiz-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .quiz-header h4 {
      color: #333;
      margin: 0;
      flex: 1;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .quiz-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .quiz-meta span {
      background: white;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #666;
      border: 1px solid #e1e5e9;
    }

    .empty-state, .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .quiz-management {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-row, .options-grid {
        grid-template-columns: 1fr;
      }

      .quizzes-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuizManagementComponent implements OnInit {
  quizzes: QuizDto[] = [];
  showCreateForm = false;
  isCreating = false;
  isLoading = true;
  quizForm: FormGroup;

  constructor(
    private trainerService: TrainerService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      timeLimit: ['', [Validators.required]],
      courseType: [''],
      batchName: [''],
      questions: this.fb.array([])
    });

    // Add initial question
    this.addQuestion();
  }

  get questionsArray() {
    return this.quizForm.get('questions') as FormArray;
  }

  ngOnInit() {
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.isLoading = true;
    this.trainerService.getMyQuizzes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.quizzes = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.error('Failed to load quizzes');
        this.isLoading = false;
      }
    });
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      questionText: ['', [Validators.required]],
      optionA: ['', [Validators.required]],
      optionB: ['', [Validators.required]],
      optionC: ['', [Validators.required]],
      optionD: ['', [Validators.required]],
      correctAnswer: ['', [Validators.required]],
      marks: [1, [Validators.required]]
    });
    this.questionsArray.push(questionGroup);
  }

  removeQuestion(index: number) {
    if (this.questionsArray.length > 1) {
      this.questionsArray.removeAt(index);
    }
  }

  createQuiz() {
    if (this.quizForm.valid) {
      this.isCreating = true;
      const quizData: QuizDto = this.quizForm.value;

      this.trainerService.createQuiz(quizData).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Quiz created successfully');
            this.quizForm.reset();
            this.showCreateForm = false;
            // Reset questions array and add one question
            while (this.questionsArray.length) {
              this.questionsArray.removeAt(0);
            }
            this.addQuestion();
            this.loadQuizzes();
          }
          this.isCreating = false;
        },
        error: (error) => {
          this.notificationService.error('Failed to create quiz');
          this.isCreating = false;
        }
      });
    }
  }
}
