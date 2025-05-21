import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

import {
  authenticateJWT,
  authorize,
  
} from "../middlewares/auth.middleware";

import { UserRole } from "../models/User";

const router = Router();

/**
 * Public routes
 */
router.get("/", getAllCategories);              // Anyone can fetch all
router.get("/:slug", getCategoryBySlug);        // Anyone can view one

/**
 * Admin-only routes
 */
router.post("/", authenticateJWT, authorize([UserRole.ADMIN]), createCategory);           // Create
router.put("/:slug", authenticateJWT, authorize([UserRole.ADMIN]), updateCategory);       // Update
router.delete("/:slug", authenticateJWT, authorize([UserRole.ADMIN]), deleteCategory);    // Delete

export default router;
