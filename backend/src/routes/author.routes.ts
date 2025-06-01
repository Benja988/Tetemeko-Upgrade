import express from "express";
import {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  verifyAuthor,
  searchAuthors,
  // getCurrentAuthorProfile, // Remove or comment if not used
} from "../controllers/author.controller";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// Public routes
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);

// Admin-only actions
router.post("/", authenticateJWT, authorize([UserRole.ADMIN]), createAuthor);
router.patch("/:id", authenticateJWT, authorize([UserRole.ADMIN]), updateAuthor);
router.delete("/:id", authenticateJWT, authorize([UserRole.ADMIN]), deleteAuthor);
router.patch("/:id/verify", authenticateJWT, authorize([UserRole.ADMIN]), verifyAuthor);

router.get("/search", searchAuthors);

export default router;
