"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
/**
 * Public routes
 */
router.get("/", category_controller_1.getAllCategories); // Anyone can fetch all
router.get("/:slug", category_controller_1.getCategoryBySlug); // Anyone can view one
/**
 * Admin-only routes
 */
router.post("/", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), category_controller_1.createCategory); // Create
router.put("/:slug", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), category_controller_1.updateCategory); // Update
router.delete("/:slug", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), category_controller_1.deleteCategory); // Delete
exports.default = router;
