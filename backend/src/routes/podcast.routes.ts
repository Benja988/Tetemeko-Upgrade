import express from "express";
import {
  createPodcast,
  getAllPodcasts,
  getPodcastById,
  updatePodcast,
  deletePodcast,
  togglePodcastStatus,
  // subscribeToPodcast,
  // unsubscribeFromPodcast,
} from "../controllers/podcast.controller";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";
import multer from "multer";
import { error } from "console";

const router = express.Router();

// Multer setup for podcast cover image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb( null, false);
    }
  },
});

// 🟢 Public routes
router.get("/", getAllPodcasts); // List all podcasts with optional category, search, pagination
router.get("/:id", getPodcastById); // Get a single podcast by ID

// 🟡 Authenticated routes
/*router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single("coverImage"),
  createPodcast
); // Create a new podcast */
router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  createPodcast
); // Create a new podcast
router.put(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single("coverImage"),
  updatePodcast
); // Update a podcast
router.delete(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  deletePodcast
); // Delete a podcast
// router.post(
//   "/:id/subscribe",
//   authenticateJWT,
//   authorize([UserRole.ADMIN]),
//   subscribeToPodcast
// ); // Subscribe to a podcast
// router.post(
//   "/:id/unsubscribe",
//   authenticateJWT,
//   authorize([UserRole.ADMIN]),
//   unsubscribeFromPodcast
// ); // Unsubscribe from a podcast

// 🔴 Admin-only route
router.patch(
  "/:id/toggle-status",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  togglePodcastStatus
); // Toggle podcast active/inactive status

export default router;