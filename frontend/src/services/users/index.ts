// src/services/users/index.ts

import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

// Re-declare enum here for frontend use
export enum UserRole {
  WEB_USER = "web_user",
  MANAGER = "manager",
  ADMIN = "admin",
}

// User interface (match what backend sends)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all users (optionally filter by role)
export const getUsers = async (page = 1, limit = 20, role?: UserRole) => {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (role) query.append("role", role);

  try {
    return await apiRequest(`/users?${query.toString()}`);
  } catch (error) {
    toast.error("Failed to fetch users.");
    return { users: [], total: 0 };
  }
};

// Search users
export const searchUsers = async (query: string) => {
  try {
    return await apiRequest(`/users/search?q=${encodeURIComponent(query)}`);
  } catch (error) {
    toast.error("User search failed.");
    return [];
  }
};

// Get one user
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    return await apiRequest(`/users/${userId}`);
  } catch (error) {
    toast.error("Failed to get user.");
    return null;
  }
};

// Update user
export const updateUser = async (
  userId: string,
  updates: Partial<Pick<User, "name" | "email" | "role" | "isActive">>
): Promise<User | null> => {
  try {
    const updated = await apiRequest(`/users/${userId}`, "PUT", updates);
    toast.success("User updated.");
    return updated;
  } catch (error) {
    toast.error("Update failed.");
    return null;
  }
};

// Soft delete user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/${userId}`, "DELETE");
    toast.success("User deactivated.");
    return true;
  } catch (error) {
    toast.error("Failed to deactivate user.");
    return false;
  }
};

// Lock user
export const lockUser = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/${userId}/lock`, "POST");
    toast.success("User locked.");
    return true;
  } catch (error) {
    toast.error("Failed to lock user.");
    return false;
  }
};

// Unlock user
export const unlockUser = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/${userId}/unlock`, "POST");
    toast.success("User unlocked.");
    return true;
  } catch (error) {
    toast.error("Failed to unlock user.");
    return false;
  }
};

// Admin password reset
export const adminResetPassword = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/${userId}/reset-password`, "POST");
    toast.success("Reset email sent.");
    return true;
  } catch (error) {
    toast.error("Failed to send reset email.");
    return false;
  }
};

// Reactivate user
export const reactivateUser = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/${userId}/reactivate`, "POST");
    toast.success("User reactivated.");
    return true;
  } catch (error) {
    toast.error("Failed to reactivate user.");
    return false;
  }
};

// Promote to manager
export const promoteToManager = async (userId: string): Promise<User | null> => {
  try {
    const updated = await apiRequest(`/users/${userId}/promote`, "POST");
    toast.success("User promoted.");
    return updated;
  } catch (error) {
    toast.error("Promotion failed.");
    return null;
  }
};
