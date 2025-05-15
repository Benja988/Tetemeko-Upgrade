import express from "express";
import {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
  getLiveStreamInfo,
  getStationSchedule,
} from "../controllers/station.controller";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getAllStations);
router.get("/:id", getStationById);
router.get("/:id/live", getLiveStreamInfo);
router.get("/:id/schedule", getStationSchedule);

// Protected routes (Admin only)
router.post("/", authenticateJWT, authorize(["admin"]), createStation);
router.put("/:id", authenticateJWT, authorize(["admin"]), updateStation);
router.delete("/:id", authenticateJWT, authorize(["admin"]), deleteStation);

export default router;
