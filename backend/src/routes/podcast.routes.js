"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const podcast_controller_1 = require("../controllers/podcast.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Multer setup for podcast cover image uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
});
// 🟢 Public routes
router.get("/", podcast_controller_1.getAllPodcasts); // List all podcasts with optional category, search, pagination
router.get("/:id", podcast_controller_1.getPodcastById); // Get a single podcast by ID
// 🟡 Authenticated routes
/*router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single("coverImage"),
  createPodcast
); // Create a new podcast */
router.post("/", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), podcast_controller_1.createPodcast); // Create a new podcast
router.put("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), upload.single("coverImage"), podcast_controller_1.updatePodcast); // Update a podcast
router.delete("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), podcast_controller_1.deletePodcast); // Delete a podcast
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
router.patch("/:id/toggle-status", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), podcast_controller_1.togglePodcastStatus); // Toggle podcast active/inactive status
exports.default = router;
