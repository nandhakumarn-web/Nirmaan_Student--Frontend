import { CourseType } from "./course-type";

export interface CourseDto {
  id?: number;
  courseType: CourseType;
  courseName: string;
  description?: string;
  durationMonths?: number;
  syllabus?: string;
  active?: boolean;
}