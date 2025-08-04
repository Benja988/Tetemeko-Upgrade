"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStationStatus = exports.deleteStation = exports.updateStation = exports.createStation = exports.getStationById = exports.getAllStations = void 0;
const Station_1 = __importDefault(require("../models/Station"));
const uploadMedia_1 = require("../utils/uploadMedia");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Get all stations (publicly accessible)
 */
const getAllStations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stations = yield Station_1.default.find();
        res.status(200).json(stations);
    }
    catch (error) {
        console.error("Error retrieving stations:", error);
        res.status(500).json({ error: "Failed to retrieve stations" });
    }
});
exports.getAllStations = getAllStations;
/**
 * Get a single station by ID
 */
const getStationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid station ID" });
            return;
        }
        const station = yield Station_1.default.findById(id);
        if (!station) {
            res.status(404).json({ error: "Station not found" });
            return;
        }
        res.status(200).json(station);
    }
    catch (error) {
        console.error("Error fetching station:", error);
        res.status(500).json({ error: "Failed to fetch station" });
    }
});
exports.getStationById = getStationById;
/**
 * Create a new station
 */
const createStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, streamUrl, imageUrl, location, genre, isActive, type, liveShow, listenerz } = req.body;
        if (!name || !location || !type) {
            res.status(400).json({ error: "Missing required fields: name, location, type" });
            return;
        }
        let uploadedImageUrl = imageUrl || "";
        if (typeof imageUrl === "string" && imageUrl.startsWith("data:image/")) {
            const result = yield (0, uploadMedia_1.uploadMedia)(imageUrl, "stations", "image");
            uploadedImageUrl = result.secure_url;
        }
        const newStation = yield Station_1.default.create({
            name,
            description: description || "",
            streamUrl: streamUrl || "",
            imageUrl: uploadedImageUrl,
            location,
            genre: Array.isArray(genre) ? genre : genre ? genre.split(",").map((g) => g.trim()) : [],
            isActive: isActive !== undefined ? isActive : true,
            type,
            liveShow: liveShow || null,
            listenerz: listenerz || 0,
        });
        res.status(201).json({ message: "Station created successfully", station: newStation });
    }
    catch (error) {
        console.error("Error creating station:", error);
        res.status(500).json({ error: "Failed to create station" });
    }
});
exports.createStation = createStation;
/**
 * Update a station
 */
const updateStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid station ID" });
            return;
        }
        if (updates.imageUrl && typeof updates.imageUrl === "string" && updates.imageUrl.startsWith("data:image/")) {
            const result = yield (0, uploadMedia_1.uploadMedia)(updates.imageUrl, "stations", "image");
            updates.imageUrl = result.secure_url;
        }
        const updatedStation = yield Station_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updates), { genre: updates.genre ? (Array.isArray(updates.genre) ? updates.genre : updates.genre.split(",").map((g) => g.trim())) : undefined }), { new: true, runValidators: true });
        if (!updatedStation) {
            res.status(404).json({ error: "Station not found" });
            return;
        }
        res.status(200).json({ message: "Station updated successfully", station: updatedStation });
    }
    catch (error) {
        console.error("Error updating station:", error);
        res.status(500).json({ error: "Failed to update station" });
    }
});
exports.updateStation = updateStation;
/**
 * Delete a station
 */
const deleteStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid station ID" });
            return;
        }
        const station = yield Station_1.default.findByIdAndDelete(id);
        if (!station) {
            res.status(404).json({ error: "Station not found" });
            return;
        }
        res.status(200).json({ message: "Station deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting station:", error);
        res.status(500).json({ error: "Failed to delete station" });
    }
});
exports.deleteStation = deleteStation;
/**
 * Toggle station active status
 */
const toggleStationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid station ID" });
            return;
        }
        const station = yield Station_1.default.findById(id);
        if (!station) {
            res.status(404).json({ error: "Station not found" });
            return;
        }
        station.isActive = !station.isActive;
        yield station.save();
        res.status(200).json({
            message: `Station is now ${station.isActive ? "active" : "inactive"}`,
            station,
        });
    }
    catch (error) {
        console.error("Error toggling station status:", error);
        res.status(500).json({ error: "Failed to toggle station status" });
    }
});
exports.toggleStationStatus = toggleStationStatus;
