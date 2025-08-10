import express from 'express';
import { getAllEpisodes, getEpisodeById, addEpisode, updateEpisode, deleteEpisode } from '../controllers/episode.controller.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for episode audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// 🟢 Public routes
router.get('/:podcastId/episodes', getAllEpisodes); // List all episodes for a podcast with optional search, pagination
router.get('/:podcastId/episodes/:episodeId', getEpisodeById); // Get a single episode by ID

// 🟡 Authenticated routes
router.post('/:podcastId/episodes', authenticateJWT, authorize([UserRole.ADMIN]), upload.single('audioFile'), addEpisode); // Add a new episode to a podcast
router.put('/:podcastId/episodes/:episodeId', authenticateJWT, authorize([UserRole.ADMIN]), upload.single('audioFile'), updateEpisode); // Update an episode
router.delete('/:podcastId/episodes/:episodeId', authenticateJWT, authorize([UserRole.ADMIN]), deleteEpisode); // Delete an episode

export default router;