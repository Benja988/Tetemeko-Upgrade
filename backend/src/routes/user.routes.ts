import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  lockUser,
  unlockUser,
  adminResetPassword,
  searchUsers,
  reactivateUser,
  promoteToManager,
} from "../controllers/user.controller";

import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Only Admins can manage users
router.use(authorize([UserRole.ADMIN]));

// Get paginated users, optional filtering by role
router.get("/", getUsers);

// Search users by name or email
router.get("/search", searchUsers);

// Get user details by ID
router.get("/:userId", getUserById);

// Update user details (name, email, role, isActive)
router.put("/:userId", updateUser);

// Soft delete (deactivate) user by ID
router.delete("/:userId", deleteUser);

// Lock user account
router.post("/:userId/lock", lockUser);

// Unlock user account
router.post("/:userId/unlock", unlockUser);

// Admin password reset (generate reset token)
router.post("/:userId/reset-password", adminResetPassword);

// Reactivate a deactivated user account
router.post("/:userId/reactivate", reactivateUser);

// Promote user to Manager role
router.post("/:userId/promote", promoteToManager);

export default router;
