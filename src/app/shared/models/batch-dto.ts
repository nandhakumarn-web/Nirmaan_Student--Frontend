export interface BatchDto {
  id?: number;
  batchName: string;
  courseId?: number;
  courseName?: string;
  trainerId?: number;
  trainerName?: string;
  startDate?: Date;
  endDate?: Date;
  maxStudents?: number;
  currentStudents?: number;
  schedule?: string;
  active?: boolean;
}