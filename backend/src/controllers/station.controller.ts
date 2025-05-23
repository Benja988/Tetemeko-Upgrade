import { Request, Response } from "express";
import mongoose from "mongoose";
import Station from "../models/Station";
import { IUser } from "../models/User";

// 🟢 Create Station
export const createStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, streamUrl, logoUrl, location, genres } = req.body;
    const user = req.user as IUser;

    const station = await Station.create({
      name,
      description,
      streamUrl,
      logoUrl,
      location,
      genres,
      owner: user._id,
    });

    res.status(201).json({ success: true, station });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating station", error });
  }
};

// 🟢 Get All Stations
export const getAllStations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { genre, isActive } = req.query;

    const filter: any = {};
    if (genre) filter.genres = genre;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const stations = await Station.find(filter).populate("owner", "name email");

    res.status(200).json({ success: true, stations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stations", error });
  }
};

// 🟢 Get Single Station by ID
export const getStationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid station ID" });
      return;
    }

    const station = await Station.findById(id).populate("owner", "name email");

    if (!station) {
      res.status(404).json({ success: false, message: "Station not found" });
      return;
    }

    res.status(200).json({ success: true, station });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching station", error });
  }
};

// 🟢 Update Station
export const updateStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user as IUser;

    const station = await Station.findById(id);

    if (!station) {
      res.status(404).json({ success: false, message: "Station not found" });
      return;
    }

    const isOwner = station.owner.toString() === user.id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: "Not authorized to update this station" });
      return;
    }

    Object.assign(station, updates);
    await station.save();

    res.status(200).json({ success: true, station });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating station", error });
  }
};

// 🟢 Delete Station
export const deleteStation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    const station = await Station.findById(id);

    if (!station) {
      res.status(404).json({ success: false, message: "Station not found" });
      return;
    }

    const isOwner = station.owner.toString() === user.id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: "Not authorized to delete this station" });
      return;
    }

    await station.deleteOne();

    res.status(200).json({ success: true, message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting station", error });
  }
};

// 🟢 Toggle Active Status (Admin only)
export const toggleStationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    if (user.role !== "admin") {
      res.status(403).json({ success: false, message: "Only admins can toggle station status" });
      return;
    }

    const station = await Station.findById(id);

    if (!station) {
      res.status(404).json({ success: false, message: "Station not found" });
      return;
    }

    station.isActive = !station.isActive;
    await station.save();

    res.status(200).json({ success: true, station });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error toggling station status", error });
  }
};
