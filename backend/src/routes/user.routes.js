"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.authenticateJWT);
// Only Admins can manage users
router.use((0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]));
// Get paginated users, optional filtering by role
router.get("/", user_controller_1.getUsers);
// Search users by name or email
router.get("/search", user_controller_1.searchUsers);
// Get user details by ID
router.get("/:userId", user_controller_1.getUserById);
// Update user details (name, email, role, isActive)
router.put("/:userId", user_controller_1.updateUser);
// Soft delete (deactivate) user by ID
router.delete("/:userId", user_controller_1.deleteUser);
router.delete("/", user_controller_1.deleteUsers);
// Lock user account
router.post("/:userId/lock", user_controller_1.lockUser);
// Unlock user account
router.post("/:userId/unlock", user_controller_1.unlockUser);
// Admin password reset (generate reset token)
router.post("/:userId/reset-password", user_controller_1.adminResetPassword);
// Reactivate a deactivated user account
router.post("/:userId/reactivate", user_controller_1.reactivateUser);
// Promote user to Manager role
router.post("/:userId/promote", user_controller_1.promoteToManager);
exports.default = router;
