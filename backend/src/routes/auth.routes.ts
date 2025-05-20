import express from "express";
import {
  registerUser,
  verifyEmail,
  login,
  inviteManager,
  registerAdmin,
  registerManager,
  promoteToAdmin,
  forgotPassword,
  resetPassword,
  logout,
  resendVerification,
  getProfile,
  updateProfile,
  deactivateAccount,
  refreshToken,
} from "../controllers/auth.controller";
import { authenticateJWT, authorize, authorizeSuperAdmin } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// 🔹 Registration & Verification
router.post("/register-user", registerUser); // Web User
router.post("/register-manager", registerManager); // Manager with invitation code
router.post("/register-admin", registerAdmin); // Admin with super admin authorization
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// 🔹 Login & Authentication
router.post("/login", login);
router.post("/logout", authenticateJWT, logout);
router.post("/refresh-token", refreshToken);

// 🔹 Password Management
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// 🔹 Manager Invitations & Role Upgrades
router.post("/invite-manager", authenticateJWT, authorize([UserRole.ADMIN]), inviteManager);
router.put("/promote/:userId", authenticateJWT, authorize([UserRole.ADMIN]), promoteToAdmin);

// 🔹 User Profile Management
router.get("/profile", authenticateJWT, getProfile);
router.put("/profile", authenticateJWT, updateProfile);

// 🔹 Account Status
router.delete("/deactivate", authenticateJWT, deactivateAccount);

export default router;
