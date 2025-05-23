import express from 'express'
import {
  createEpisode,
  getAllEpisodes,
  getEpisodesByPodcast,
  getEpisodeById,
  updateEpisode,
  deleteEpisode,
} from '../controllers/episode.controller'

import { authenticateJWT, authorize } from '../middlewares/auth.middleware'
import { UserRole } from '../models/User'

const router = express.Router()

// Public routes (no auth required)
router.get('/', getAllEpisodes)
router.get('/:id', getEpisodeById)
router.get('/podcast/:podcastId', getEpisodesByPodcast)

// Protected routes (authenticated + authorized)
router.post(
  '/',
  authenticateJWT,
  authorize([UserRole.ADMIN]), // example roles that can create
  createEpisode
)

router.put('/:id', authenticateJWT, authorize([UserRole.ADMIN]), updateEpisode)

router.delete(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  deleteEpisode
)

export default router
