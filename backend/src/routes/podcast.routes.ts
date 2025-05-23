import express from "express";
import {
  createPodcast,
  getAllPodcasts,
  getPodcastById,
  updatePodcast,
  deletePodcast,
  togglePodcastStatus,
} from "../controllers/podcast.controller";

import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// 🟢 Public routes
router.get("/", getAllPodcasts);                  // List all podcasts
router.get("/:id", getPodcastById);               // Get single podcast

// 🟡 Authenticated routes
router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  createPodcast
);

router.put(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  updatePodcast
);

router.delete(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  deletePodcast
);

// 🔴 Admin route
router.patch(
  "/:id/toggle-status",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  togglePodcastStatus
);

export default router;
