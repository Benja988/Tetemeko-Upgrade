import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
  incrementViews,
  getFeaturedNews,
  getBreakingNews,
  searchNews,
  getNewsByCategory,
  getRecentNews,
  getNewsStats,
} from "../controllers/news.controller";

import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/featured", getFeaturedNews);
router.get("/breaking", getBreakingNews);
router.get("/search", searchNews);
router.get("/category/:category", getNewsByCategory);
router.get("/recent", getRecentNews);
router.get("/stats", getNewsStats);
router.get("/:id", getNewsById);
router.post("/:id/views", incrementViews); // increment views publicly

// Protected routes
router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  createNews
);

router.put(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  updateNewsById
);

router.delete(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  deleteNewsById
);

export default router;
