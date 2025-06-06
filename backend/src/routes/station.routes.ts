import express from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
  toggleStationStatus,
} from "../controllers/station.controller";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getAllStations);                // Get all stations
router.get("/:id", getStationById);             // Get single station by ID

// 🟡 Authenticated Routes (Owner or Admin handled in controller logic)
router.post("/", authenticateJWT, createStation);  // Create station

router.put("/:id", authenticateJWT, updateStation); // Update station

router.delete("/:id", authenticateJWT, deleteStation); // Delete station

// 🔴 Admin Only
router.patch(
  "/:id/toggle-status",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  toggleStationStatus
); // Toggle isActive status

export default router;
