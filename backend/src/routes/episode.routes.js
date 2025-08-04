"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const episode_controller_1 = require("../controllers/episode.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Multer setup for episode audio file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["audio/mpeg", "audio/wav"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            // cb(new Error("Invalid file type. Only MP3 and WAV are allowed."), false);
        }
    },
});
// 🟢 Public routes
router.get("/:podcastId/episodes", episode_controller_1.getAllEpisodes); // List all episodes for a podcast with optional search, pagination
router.get("/:podcastId/episodes/:episodeId", episode_controller_1.getEpisodeById); // Get a single episode by ID
// 🟡 Authenticated routes
router.post("/:podcastId/episodes", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), upload.single("audioFile"), episode_controller_1.addEpisode); // Add a new episode to a podcast
router.put("/:podcastId/episodes/:episodeId", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), upload.single("audioFile"), episode_controller_1.updateEpisode); // Update an episode
router.delete("/:podcastId/episodes/:episodeId", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), episode_controller_1.deleteEpisode); // Delete an episode
exports.default = router;
