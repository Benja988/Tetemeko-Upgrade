import { Request, Response } from "express";
import Station from "../models/Station";
import { uploadMedia, CloudinaryUploadResult } from "../utils/uploadMedia";
import mongoose from "mongoose";

/**
 * Get all stations (publicly accessible)
 */
export const getAllStations = async (req: Request, res: Response): Promise<void> => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    console.error("Error retrieving stations:", error);
    res.status(500).json({ error: "Failed to retrieve stations" });
  }
};

/**
 * Get a single station by ID
 */
export const getStationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid station ID" });
      return;
    }

    const station = await Station.findById(id);
    if (!station) {
      res.status(404).json({ error: "Station not found" });
      return;
    }

    res.status(200).json(station);
  } catch (error) {
    console.error("Error fetching station:", error);
    res.status(500).json({ error: "Failed to fetch station" });
  }
};

/**
 * Create a new station
 */
export const createStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, streamUrl, imageUrl, location, genre, isActive, type, liveShow, listenerz } = req.body;

    if (!name || !location || !type) {
      res.status(400).json({ error: "Missing required fields: name, location, type" });
      return;
    }

    let uploadedImageUrl = imageUrl || "";
    if (typeof imageUrl === "string" && imageUrl.startsWith("data:image/")) {
      const result = await uploadMedia(imageUrl, "stations", "image") as CloudinaryUploadResult;
      uploadedImageUrl = result.secure_url;
    }

    const newStation = await Station.create({
      name,
      description: description || "",
      streamUrl: streamUrl || "",
      imageUrl: uploadedImageUrl,
      location,
      genre: Array.isArray(genre) ? genre : genre ? genre.split(",").map((g: string) => g.trim()) : [],
      isActive: isActive !== undefined ? isActive : true,
      type,
      liveShow: liveShow || null,
      listenerz: listenerz || 0,
    });

    res.status(201).json({ message: "Station created successfully", station: newStation });
  } catch (error) {
    console.error("Error creating station:", error);
    res.status(500).json({ error: "Failed to create station" });
  }
};

/**
 * Update a station
 */
export const updateStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid station ID" });
      return;
    }

    if (updates.imageUrl && typeof updates.imageUrl === "string" && updates.imageUrl.startsWith("data:image/")) {
      const result = await uploadMedia(updates.imageUrl, "stations", "image") as CloudinaryUploadResult;
      updates.imageUrl = result.secure_url;
    }

    const updatedStation = await Station.findByIdAndUpdate(
      id,
      { ...updates, genre: updates.genre ? (Array.isArray(updates.genre) ? updates.genre : updates.genre.split(",").map((g: string) => g.trim())) : undefined },
      { new: true, runValidators: true }
    );

    if (!updatedStation) {
      res.status(404).json({ error: "Station not found" });
      return;
    }

    res.status(200).json({ message: "Station updated successfully", station: updatedStation });
  } catch (error) {
    console.error("Error updating station:", error);
    res.status(500).json({ error: "Failed to update station" });
  }
};

/**
 * Delete a station
 */
export const deleteStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid station ID" });
      return;
    }

    const station = await Station.findByIdAndDelete(id);
    if (!station) {
      res.status(404).json({ error: "Station not found" });
      return;
    }

    res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    console.error("Error deleting station:", error);
    res.status(500).json({ error: "Failed to delete station" });
  }
};

/**
 * Toggle station active status
 */
export const toggleStationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid station ID" });
      return;
    }

    const station = await Station.findById(id);
    if (!station) {
      res.status(404).json({ error: "Station not found" });
      return;
    }

    station.isActive = !station.isActive;
    await station.save();

    res.status(200).json({
      message: `Station is now ${station.isActive ? "active" : "inactive"}`,
      station,
    });
  } catch (error) {
    console.error("Error toggling station status:", error);
    res.status(500).json({ error: "Failed to toggle station status" });
  }
};