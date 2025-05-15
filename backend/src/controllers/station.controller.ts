import { Request, Response, NextFunction } from "express";
import Station from "../models/Station";

// @desc Get all stations
export const getAllStations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    next(error);
  }
};

// @desc Get a single station by ID
export const getStationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }
    res.status(200).json(station);
  } catch (error) {
    next(error);
  }
};

// @desc Create a new station (Admin only)
export const createStation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, streamUrl, description, logo, schedule } = req.body;

    const station = new Station({ name, streamUrl, description, logo, schedule });
    await station.save();

    res.status(201).json({ message: "Station created successfully", station });
  } catch (error) {
    next(error);
  }
};

// @desc Update a station (Admin only)
export const updateStation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStation) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    res.status(200).json({ message: "Station updated", updatedStation });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a station (Admin only)
export const deleteStation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    res.status(200).json({ message: "Station deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc Get live stream URL & now-playing info
export const getLiveStreamInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    const nowPlaying = {
      track: "Live Broadcast",
      host: "Tetemeko Radio Host",
    };

    res.status(200).json({ streamUrl: station.streamUrl, nowPlaying });
  } catch (error) {
    next(error);
  }
};

// @desc Get upcoming shows for a station
export const getStationSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    res.status(200).json(station.schedule);
  } catch (error) {
    next(error);
  }
};
