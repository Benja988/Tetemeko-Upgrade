"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const station_controller_1 = require("../controllers/station.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// 🟢 Public Routes
router.get("/", station_controller_1.getAllStations); // Get all stations
router.get("/:id", station_controller_1.getStationById); // Get single station by ID
// 🟡 Authenticated Routes (Owner or Admin handled in controller logic)
router.post("/", auth_middleware_1.authenticateJWT, station_controller_1.createStation); // Create station
router.put("/:id", auth_middleware_1.authenticateJWT, station_controller_1.updateStation); // Update station
router.delete("/:id", auth_middleware_1.authenticateJWT, station_controller_1.deleteStation); // Delete station
// 🔴 Admin Only
router.patch("/:id/toggle-status", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), station_controller_1.toggleStationStatus); // Toggle isActive status
exports.default = router;
