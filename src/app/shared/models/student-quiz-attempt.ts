export interface StudentQuizAttempt {
  id?: number;
  studentId?: number;
  quizId?: number;
  startTime?: Date;
  endTime?: Date;
  totalQuestions?: number;
  correctAnswers?: number;
  score?: number;
  answers?: string;
  completed?: boolean;
}