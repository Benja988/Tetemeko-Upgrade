import express from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/station.controller";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getAllStations);                // Get all stations
router.get("/:id", getStationById);             // Get single station by ID

// 🟡 Authenticated Routes
router.post(
  "/",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  createStation
);                                               // Create a station

router.put(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  updateStation
);                                               // Update a station

router.delete(
  "/:id",
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  deleteStation
);

export default router;