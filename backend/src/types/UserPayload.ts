// src/types/UserPayload.ts

export type UserRole = "admin" | "author" | "reviewer";

export interface UserPayload {
  id: string;
  role: UserRole;
}
