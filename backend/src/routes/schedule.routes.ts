import express from "express";
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";

import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// Public routes
router.get("/", getAllSchedules);
router.get("/:id", getScheduleById);

// Protected routes
router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]), // roles allowed to create schedules
  createSchedule
);

router.put(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]), // roles allowed to update schedules
  updateSchedule
);

router.delete(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]), // only admin can delete schedules
  deleteSchedule
);

export default router;
