export interface TrainerDto {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  trainerId?: string;
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  joiningDate?: Date;
  certification?: string;
}