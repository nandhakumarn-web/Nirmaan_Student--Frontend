import { FeedbackType } from "./feedback-type";

export interface FeedbackDto {
  id?: number;
  studentName?: string;
  trainerName?: string;
  courseName?: string;
  feedbackType: FeedbackType;
  rating: number;
  comments?: string;
  anonymous?: boolean;
  submittedAt?: Date;
}