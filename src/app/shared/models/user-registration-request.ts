import { CourseType } from "./course-type";
import { Role } from "./role";

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: string;
  enrolledCourse?: CourseType;
  qualification?: string;
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  certification?: string;
}