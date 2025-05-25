// src/types/user.ts

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  WEB_USER = "web_user",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  failedLoginAttempts?: number;
  lockUntil?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Add this below IUser
export interface UserTableProps {
  users: IUser[];
  search: string;
  filter: string;
}
