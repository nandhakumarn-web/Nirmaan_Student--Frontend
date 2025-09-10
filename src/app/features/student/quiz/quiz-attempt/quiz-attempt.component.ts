import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../service/student.service';

@Component({
  selector: 'app-quiz-attempt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="quiz-attempt">
      <div class="quiz-header">
        <h1>{{ quiz?.title }}</h1>
        <div class="timer" *ngIf="timeRemaining > 0">
          Time Remaining: {{ formatTime(timeRemaining) }}
        </div>
      </div>

      <form [formGroup]="quizForm" (ngSubmit)="submitQuiz()" *ngIf="quiz">
        <div
          class="question"
          *ngFor="let question of quiz.questions; let i = index"
        >
          <h3>{{ i + 1 }}. {{ question.questionText }}</h3>
          <div class="options">
            <label>
              <input
                type="radio"
                [formControlName]="'question_' + question.id"
                value="A"
              />
              {{ question.optionA }}
            </label>
            <label>
              <input
                type="radio"
                [formControlName]="'question_' + question.id"
                value="B"
              />
              {{ question.optionB }}
            </label>
            <label>
              <input
                type="radio"
                [formControlName]="'question_' + question.id"
                value="C"
              />
              {{ question.optionC }}
            </label>
            <label>
              <input
                type="radio"
                [formControlName]="'question_' + question.id"
                value="D"
              />
              {{ question.optionD }}
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Quiz' }}
        </button>
      </form>
    </div>
  `,
  styles: [
    /* Add your styles here */
  ],
})
export class QuizAttemptComponent implements OnInit {
  quiz: any = null;
  quizForm: FormGroup;
  timeRemaining = 0;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({});
  }

  ngOnInit() {
    const quizId = this.route.snapshot.params['id'];
    this.loadQuiz(quizId);
  }

  loadQuiz(quizId: number) {
    // Implementation to load quiz details
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  submitQuiz() {
    // Implementation to submit quiz answers
  }
}
