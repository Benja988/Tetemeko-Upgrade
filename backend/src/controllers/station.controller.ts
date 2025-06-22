import { Request, Response } from "express";
import Station from "../models/Station";
import { uploadMedia } from "../utils/uploadMedia";

/**
 * Get all stations (publicly accessible)
 */
export const getAllStations = async (req: Request, res: Response): Promise<void> => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve stations", error });
  }
};

/**
 * Get a single station by ID
 */
export const getStationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: "Error fetching station", error });
  }
};

/**
 * Create a new station
 */
export const createStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description = "",
      streamUrl = "",
      imageUrl = "",
      location,
      genre = [],
      isActive = true,
      type,
      liveShow = null,
      listenerz = 0,
    } = req.body;

    if (!name?.trim() || !location?.trim() || !type?.trim()) {
      res.status(400).json({ message: "Missing required fields: name, location, type" });
      return;
    }

    let uploadedImageUrl = "";

    // Upload only if it's a base64 image string
    if (typeof imageUrl === "string" && imageUrl.startsWith("data:image/")) {
      uploadedImageUrl = await uploadMedia(imageUrl, "stations", "image");
    } else {
      uploadedImageUrl = imageUrl?.trim?.() || "";
    }

    const newStation = await Station.create({
      name: name.trim(),
      description: description.trim(),
      streamUrl: streamUrl.trim(),
      imageUrl: uploadedImageUrl,
      location: location.trim(),
      genre: Array.isArray(genre) ? genre : genre.split(",").map((g: string) => g.trim()),
      isActive,
      type: type.trim(),
      liveShow,
      listenerz,
    });

    res.status(201).json(newStation);
  } catch (error) {
    console.error("Error creating station:", error);
    res.status(500).json({ message: "Failed to create station" });
  }
};

/**
 * Update a station
 */
export const updateStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    const updates = req.body;
    Object.assign(station, updates);
    await station.save();

    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: "Failed to update station", error });
  }
};

/**
 * Delete a station
 */
export const deleteStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    await Station.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete station", error });
  }
};

/**
 * Toggle station active status
 */
export const toggleStationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    station.isActive = !station.isActive;
    await station.save();

    res.status(200).json({
      message: `Station is now ${station.isActive ? "active" : "inactive"}`,
      station,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle station status", error });
  }
};
