"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// 🔹 Registration & Verification
router.post("/register-user", auth_controller_1.registerUser); // Web User
router.post("/register-manager", auth_controller_1.registerManager); // Manager with invitation code
router.post("/register-admin", auth_controller_1.registerAdmin); // Admin with super admin authorization
router.get("/verify-email", auth_controller_1.verifyEmail);
router.post("/resend-verification", auth_controller_1.resendVerification);
// 🔹 Login & Authentication
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_middleware_1.authenticateJWT, auth_controller_1.logout);
router.post("/refresh-token", auth_controller_1.refreshToken);
// 🔹 Password Management
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
// 🔹 Manager Invitations & Role Upgrades
router.post("/invite-manager", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), auth_controller_1.inviteManager);
router.put("/promote/:userId", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), auth_controller_1.promoteToAdmin);
// 🔹 User Profile Management
router.get("/profile", auth_middleware_1.authenticateJWT, auth_controller_1.getProfile);
router.put("/profile", auth_middleware_1.authenticateJWT, auth_controller_1.updateProfile);
// 🔹 Account Status
router.delete("/deactivate", auth_middleware_1.authenticateJWT, auth_controller_1.deactivateAccount);
exports.default = router;
