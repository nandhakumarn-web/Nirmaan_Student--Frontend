import { CourseType } from "./course-type";
import { QuestionDto } from "./question-dto";

export interface QuizDto {
  id?: number;
  title: string;
  description?: string;
  trainerName?: string;
  courseType?: CourseType;
  batchName?: string;
  timeLimit?: number;
  startTime?: Date;
  endTime?: Date;
  active?: boolean;
  questions?: QuestionDto[];
}