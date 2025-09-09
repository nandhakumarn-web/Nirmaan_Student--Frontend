import { AttendanceStatus } from "./attendance-status";

export interface AttendanceDto {
  id?: number;
  studentId?: number;
  studentName?: string;
  batchName?: string;
  attendanceDate?: Date;
  status: AttendanceStatus;
  markedAt?: Date;
}