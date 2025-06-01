import { Request, Response } from "express";
import Station from "../models/Station";

/**
 * Get all active stations (publicly accessible)
 */
export const getAllStations = async (req: Request, res: Response): Promise<void> => {
  try {
    const stations = await Station.find({ isActive: true });
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve stations", error });
  }
};

/**
 * Get a single station by ID (publicly accessible)
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
 * Create a new station (authenticated users — no ownership tracking)
 */
export const createStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, streamUrl, logoUrl, location, genres } = req.body;

    const station = await Station.create({
      name,
      description,
      streamUrl,
      logoUrl,
      location,
      genres,
    });

    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: "Failed to create station", error });
  }
};

/**
 * Update a station (authenticated — no ownership check)
 */
export const updateStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    Object.assign(station, req.body);
    await station.save();

    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: "Failed to update station", error });
  }
};

/**
 * Delete a station (authenticated — no ownership check)
 */
export const deleteStation = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Deleting station with id:", req.params.id);
    const station = await Station.findById(req.params.id);
    if (!station) {
      console.log("Station not found");
      res.status(404).json({ message: "Station not found" });
      return;
    }

    await Station.findByIdAndDelete(req.params.id);
    console.log("Station deleted successfully");
    res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    console.error("Failed to delete station", error);
    res.status(500).json({ message: "Failed to delete station", error });
  }
};


/**
 * Toggle station's isActive status (still assumes admin-only route protection)
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
