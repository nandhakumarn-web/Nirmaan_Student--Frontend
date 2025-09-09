import { Role } from "./role";

export interface User {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
