import { Role } from "./role";

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}